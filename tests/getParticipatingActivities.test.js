import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /users/:id/participatingActivities → [] όταν ο χρήστης δεν συμμετέχει πουθενά', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/999/participatingActivities`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.deepEqual(res.body.data, []);
  } finally {
    server.close();
  }
});