import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Load Test για Route 1: Get Activities (πιο βαρύ endpoint - φέρνει όλες τις δραστηριότητες)
  // Proper load test durations for sustained load analysis
  stages: [
    { duration: '30s', target: 250 },  // Ramp-up: gradually increase to target load
    { duration: '1m', target: 400 },  // Further ramp-up to moderate load
    { duration: '1m', target: 600 }, // Further ramp-up to higher load
    { duration: '1m', target: 700 }, // Ramp-up to peak load
    { duration: '2m30s', target: 700 }, // Stable load: sustained load to observe system behavior
    { duration: '1m', target: 0 },     // Ramp-down: gracefully decrease load
  ],
  thresholds: {
    // Πιο χαλαρά όρια λόγω πολλαπλών εγγραφών
    http_req_duration: [{ threshold: 'p(95)<100', abortOnFail: true }], 
    
    // Fail if > 1% errors
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],   
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Route 1: Get Activities
  const res = http.get(`${BASE_URL}/users/1/activities`);
  
  // Checks για καλύτερη ανάλυση αποτελεσμάτων
  check(res, { 
    'Activities status is 200': (r) => r.status === 200,
    'Activities status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  // Randomized Think Time (Best Practice από Εργαστήριο)
  sleep(Math.random() * 3); 
}
