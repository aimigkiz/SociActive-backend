import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('POST /users/:id/activities/:activityId/joinRequests → 400 όταν user είναι ήδη participant', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // Σύμφωνα με τα mock σου, activity 101 έχει participants [1,2,3,7]
    const res = await got.post(`${url}/users/1/activities/101/joinRequests`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 400);
    t.is(res.body.message, 'You are already participating in this activity.');
  } finally {
    server.close();
  }
});