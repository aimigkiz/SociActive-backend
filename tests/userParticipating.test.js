import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /users/:userId/participatingActivities → 200 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/participatingActivities`, {
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

test('GET /users/:userId/participatedActivities → 200 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/participatedActivities`, {
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

test('PUT /users/:userId/points → 200 points updated', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/1/points`, {
      json: { points: 50 },
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