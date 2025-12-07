// tests/socialActions.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('POST /users/:userId/activities/:activityId/shares → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/activities/101/shares`, {
      json: { receiverIds: [2, 3] },
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

test('POST /users/:userId/activities/:activityId/chats/messages → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(
      `${url}/users/1/activities/101/chats/messages`,
      {
        json: { messageContent: 'Hello there!' },
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 201);
    t.true(res.body.success);
    t.truthy(res.body.data);
  } finally {
    server.close();
  }
});

test('POST /users/:userId/activities/:activityId/saves → 201 success', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/activities/101/saves`, {
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