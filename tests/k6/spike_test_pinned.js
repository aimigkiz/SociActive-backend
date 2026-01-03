import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Spike Test για Route 2: Get Pinned Activities (ελαφρύτερο endpoint)
  // Πιο απότομο spike - ελέγχει αντοχή σε extreme traffic
  stages: [
    { duration: '2s', target: 10 },
    { duration: '4s', target: 120 }, // AGGRESSIVE SPIKE! 120 VUs (περισσότεροι από activities)
    { duration: '8s', target: 120 }, // Συντομότερο plateau
    { duration: '4s', target: 0 },   // Γρήγορο recovery
  ],
  thresholds: {
    // Πιο αυστηρά όρια - το endpoint πρέπει να αντέξει καλύτερα
    http_req_failed: [{ threshold: 'rate<0.03', abortOnFail: true }],  // 3% errors
    http_req_duration: [{ threshold: 'p(95)<150', abortOnFail: true }], // 150ms
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Route 2: Get Pinned Activities
  const res = http.get(`${BASE_URL}/users/1/activities/pinned`);

  check(res, { 
    'Pinned status 2xx': (r) => r.status >= 200 && r.status < 300 
  });

  // Μικρότερο sleep στο spike για μεγαλύτερη πίεση
  sleep(Math.random() * 2);
}
