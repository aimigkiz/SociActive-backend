import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// CASE A — 404: activity does not exist
test('PUT /users/:userId/activities/:id/details returns 404 when activity does not exist', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/1/activities/999999/details`, {
      json: { title: "New title" },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});

// CASE B — 404: user is NOT the host
test('PUT /users/:userId/activities/:id/details returns 404 when user is not the host', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // activity 101 has hostId = 1
    // using userId = 5 should produce 404
    const res = await got.put(`${url}/users/5/activities/101/details`, {
      json: { title: "Updated Title" },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});

// CASE C — SUCCESS: host updates the details
test('PUT /users/:userId/activities/:id/details updates activity details successfully', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // userId = 1 is the host of activity 101
    const res = await got.put(`${url}/users/1/activities/101/details`, {
      json: { title: "Updated Title" },
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

test('GET /users/:userId/activities/:id/details returns 404 for non-existing activity', async t => {
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

test('GET /users/:userId/activities/:id/details returns details for existing activity', async t => {
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