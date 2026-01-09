import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Load Test για Route 2: Get Pinned Activities (πιο ελαφρύ endpoint - filtered data)
  // Proper load test durations for sustained load analysis
  stages: [
    { duration: '30s', target: 500 },  // Ramp-up: gradually increase to target load
    { duration: '30s', target: 1000 }, // Further ramp-up to moderate load
    { duration: '30s', target: 1500 }, // Further ramp-up to higher load
    { duration: '1m', target: 2000 }, // Ramp-up to peak load
    { duration: '3m', target: 2000 }, // Peak load: maintain peak load for extended analysis
    { duration: '1m', target: 0 },     // Ramp-down: gracefully decrease load
  ],
  thresholds: {
    // Πιο αυστηρά όρια - αναμένουμε ταχύτερη απόκριση
    http_req_duration: [{ threshold: 'p(95)<80', abortOnFail: true }], 
    
    // Fail if > 1% errors
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],   
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Route 2: Get Pinned Activities
  const res = http.get(`${BASE_URL}/users/1/activities/pinned`);
  
  // Checks για καλύτερη ανάλυση αποτελεσμάτων
  check(res, { 
    'Pinned status is 200': (r) => r.status === 200,
    'Pinned status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  // Randomized Think Time (Best Practice από Εργαστήριο)
  sleep(Math.random() * 3); 
}
