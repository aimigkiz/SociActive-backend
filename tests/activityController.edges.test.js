import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) GET /users/:userId/activities/:activityId/details → 404 όταν δεν υπάρχει activity
test('GET /users/:userId/activities/:activityId/details → 404 όταν δεν υπάρχει activity', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities/999999/details`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.success, false);
    t.is(res.body.message, 'Activity not found');
  } finally {
    server.close();
  }
});

// 2) PUT /users/:userId/activities/:activityId/details → 404 όταν το activity δεν υπάρχει
test('PUT /users/:userId/activities/:activityId/details → 404 όταν το activity δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/1/activities/999999/details`, {
      json: { location: 'Nowhere' },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Activity not found or not authorized');
  } finally {
    server.close();
  }
});

// 3) PUT /users/:userId/activities/:activityId/details → 404 όταν ο user δεν είναι host
test('PUT /users/:userId/activities/:activityId/details → 404 όταν user δεν είναι host', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  // Στα mock, το activity 101 έχει hostId = 1, άρα userId=2 δεν είναι host
  try {
    const res = await got.put(`${url}/users/2/activities/101/details`, {
      json: { location: 'Unauthorized edit' },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Activity not found or not authorized');
  } finally {
    server.close();
  }
});

// 4) PUT /users/:userId/activities/:activityId/joinRequests/:joinRequestId → 404 όταν δεν υπάρχει join-request
test('PUT /users/:userId/activities/:activityId/joinRequests/:joinRequestId → 404 όταν δεν υπάρχει join-request', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(
      `${url}/users/1/activities/101/joinRequests/999999`,
      {
        json: { status: 'accepted' },
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Join-request not found');
  } finally {
    server.close();
  }
});

// 5) DELETE /users/:userId/activities/:activityId/pins → 404 όταν δεν υπάρχει pin
test('DELETE /users/:userId/activities/:activityId/pins → 404 όταν δεν υπάρχει pin', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  // Στα mock pins, μόνο ο user 1 έχει pins για 101 και 103.
  // Άρα user 2 για activity 101 δεν έχει pin.
  try {
    const res = await got.delete(`${url}/users/2/activities/101/pins`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.success, false);
    t.is(res.body.message, 'Pin not found');
  } finally {
    server.close();
  }
});