import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /users/:id/activities/pinned → [] όταν δεν υπάρχουν pins', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/123/activities/pinned`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.deepEqual(res.body.data, []);
  } finally {
    server.close();
  }
});