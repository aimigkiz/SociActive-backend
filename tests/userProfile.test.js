import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// SUCCESS CASE
test('GET /users/:userId/profiles/:profileId → 200 profile found', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/profiles/1`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
  } finally {
    server.close();
  }
});

// NOT FOUND CASE
test('GET /users/:userId/profiles/:profileId → 404 profile not found', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/profiles/999999`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});