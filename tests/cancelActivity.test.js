import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('DELETE /users/:userId/activities/:activityId returns 404 if activity does not exist', async t => {
  const server = http.createServer(app);
  const url = await listen(server);
  try {
    const res = await got.delete(`${url}/users/1/activities/999999`, {
      responseType: 'json',
      throwHttpErrors: false
    });
    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});

test('DELETE /users/:userId/activities/:activityId returns 404 if user is not host', async t => {
  const server = http.createServer(app);
  const url = await listen(server);
  try {
    // hostId = 1, so using userId = 99 should fail
    const res = await got.delete(`${url}/users/99/activities/101`, {
      responseType: 'json',
      throwHttpErrors: false
    });
    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});

test('DELETE /users/:userId/activities/:activityId returns 204 when host cancels', async t => {
  const server = http.createServer(app);
  const url = await listen(server);
  try {
    const res = await got.delete(`${url}/users/1/activities/101`, {
      throwHttpErrors: false
    });
    t.is(res.statusCode, 204);
  } finally {
    server.close();
  }
});