import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Spike Test: Απότομη αύξηση φορτίου
  stages: [
    { duration: '2s', target: 10 },
    { duration: '5s', target: 100 }, // SPIKE! 100 VUs
    { duration: '10s', target: 100 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    // Στο Spike είμαστε λίγο πιο ελαστικοί (5% errors, 200ms χρόνο)
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<200', abortOnFail: true }], 
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Batch requests για μέγιστη πίεση
  const responses = http.batch([
    ['GET', `${BASE_URL}/users/1/activities`],
    ['GET', `${BASE_URL}/users/1/activities/pinned`],
  ]);

  check(responses[0], { 'Activities status 2xx': (r) => r.status >= 200 && r.status < 300 });
  check(responses[1], { 'Pinned status 2xx': (r) => r.status >= 200 && r.status < 300 });

  sleep(Math.random() * 2); // Μικρότερο sleep στο spike για μεγαλύτερη πίεση
}