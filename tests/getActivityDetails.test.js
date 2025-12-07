import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// SUCCESS CASE
test('GET /users/:userId/activities/:activityId/details → 200', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities/101/details`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.truthy(res.body.data);
  } finally {
    server.close();
  }
});

// NOT FOUND CASE
test('GET /users/:userId/activities/:activityId/details → 404 όταν δεν υπάρχει activity', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities/999999/details`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});