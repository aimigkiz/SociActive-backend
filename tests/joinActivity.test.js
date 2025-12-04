import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) Activity not found → 404
test('POST /users/:userId/activities/:activityId/joinRequests → 404 όταν δεν υπάρχει activity', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/10/activities/999999/joinRequests`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Activity not found');
  } finally {
    server.close();
  }
});


// 2) Already participating → 400
test('POST /users/:userId/activities/:activityId/joinRequests → 400 όταν ο χρήστης είναι ήδη participant', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // user 1 είναι ήδη στους participants [1,2,3,7]
    const res = await got.post(`${url}/users/1/activities/101/joinRequests`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 400);
    t.is(res.body.message, 'You are already participating in this activity.');
  } finally {
    server.close();
  }
});


// 3) Success → 201
test('POST /users/:userId/activities/:activityId/joinRequests → 201 για νέο participant', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // user 10 δεν είναι participant στο activity 101
    const res = await got.post(`${url}/users/10/activities/101/joinRequests`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
    t.is(res.body.message, 'The join request is created successfully.');
    t.truthy(res.body.data);
  } finally {
    server.close();
  }
});