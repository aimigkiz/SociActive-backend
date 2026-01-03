import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Load Test για Route 2: Get Pinned Activities (πιο ελαφρύ endpoint - filtered data)
  // Scaled για GitHub Runner environment
  stages: [
    { duration: '8s', target: 60 },  // Ramp-up ταχύτερο
    { duration: '25s', target: 60 }, // Stable load - περισσότεροι VUs λόγω ελαφρύτερου query
    { duration: '7s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    // Πιο αυστηρά όρια - αναμένουμε ταχύτερη απόκριση
    http_req_duration: [{ threshold: 'p(95)<60', abortOnFail: true }], 
    
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
