import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('POST /users/:userId/activities δημιουργεί activity (hostActivity)', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const body = {
      title: 'Test Activity',
      description: 'Test description',
      details: { maxParticipants: 5 }
    };

    const res = await got.post(`${url}/users/1/activities`, {
      json: body,
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
    t.truthy(res.body.data);
  } finally {
    server.close();
  }
});