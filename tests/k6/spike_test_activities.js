import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Spike Test για Route 1: Get Activities (βαρύτερο endpoint)
  // Πιο σταδιακό spike λόγω πολυπλοκότητας
  stages: [
    { duration: '3s', target: 10 },
    { duration: '7s', target: 80 },  // SPIKE! 80 VUs (λιγότεροι από το pinned)
    { duration: '12s', target: 80 }, // Μεγαλύτερη διάρκεια plateau
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    // Πιο χαλαρά όρια για το βαρύτερο endpoint
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<250', abortOnFail: true }], 
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Route 1: Get Activities
  const res = http.get(`${BASE_URL}/users/1/activities`);

  check(res, { 
    'Activities status 2xx': (r) => r.status >= 200 && r.status < 300 
  });

  // Μικρότερο sleep στο spike για μεγαλύτερη πίεση
  sleep(Math.random() * 2);
}
