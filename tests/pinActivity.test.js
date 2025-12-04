import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('POST /users/:userId/activities/:activityId/pins → 201 created', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/activities/101/pins`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
  } finally {
    server.close();
  }
});