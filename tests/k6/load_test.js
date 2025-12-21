import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // R-23: Scaled down from 1000 to 50 VUs for GitHub Runner environment
  stages: [
    { duration: '10s', target: 50 }, // Ramp-up
    { duration: '30s', target: 50 }, // Stable load
    { duration: '10s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    // R-25: Target < 80ms.
    // abortOnFail: true -> Σταματάει αν αποτύχει (Best Practice από Εργαστήριο)
    http_req_duration: [{ threshold: 'p(95)<80', abortOnFail: true }], 
    
    // Fail if > 1% errors
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],   
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Route 1: Get Activities
  const res1 = http.get(`${BASE_URL}/users/1/activities`);
  
  // Checks για καλύτερη ανάλυση αποτελεσμάτων
  check(res1, { 
    'Activities status is 200': (r) => r.status === 200,
    'Activities status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  // Route 2: Get Pinned Activities
  const res2 = http.get(`${BASE_URL}/users/1/activities/pinned`);
  check(res2, { 
    'Pinned status is 200': (r) => r.status === 200,
    'Pinned status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  // Randomized Think Time (Best Practice από Εργαστήριο)
  sleep(Math.random() * 3); 
}