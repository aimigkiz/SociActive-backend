import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /users/:userId/activities/pinned → 200 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities/pinned`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.true(Array.isArray(res.body.data));
  } finally {
    server.close();
  }
});