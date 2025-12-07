import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('POST /users/:userId/friendRequests → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/friendRequests`, {
      json: { toUserId: 2 },
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

test('POST /users/:userId/notifications → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/notifications`, {
      json: { message: "Hello!" },
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

test('POST /users/:userId/userRatings → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/userRatings`, {
      json: { rating: 5 },
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