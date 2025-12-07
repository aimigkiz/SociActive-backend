import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) GET /users/:userId/profiles/:profileId → επιτυχημένο 200 (υπάρχων χρήστης)
test('GET /users/:userId/profiles/:profileId → 200 όταν το προφίλ υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // userId = 1, profileId = 1 υπάρχουν στα mock δεδομένα
    const res = await got(`${url}/users/1/profiles/1`, {
      responseType: 'json'
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.is(res.body.data.userId, 1);
  } finally {
    server.close();
  }
});

// 2) PUT /users/:userId/points → 200 όταν ο χρήστης υπάρχει (success branch)
test('PUT /users/:userId/points → 200 όταν ο χρήστης υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/1/points`, {
      json: { addedPoints: 5 },
      responseType: 'json'
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.is(typeof res.body.data.totalPoints, 'number');
  } finally {
    server.close();
  }
});

// 3) POST /users/:userId/activities/:activityId/reviews → 201 όταν το activity έχει completed=true
test('POST /users/:userId/activities/:activityId/reviews → 201 όταν το activity έχει completed=true', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * Στα mock δεδομένα:
   * activityId 106 ή 107 έχουν completed: true
   */
  try {
    const res = await got.post(`${url}/users/1/activities/106/reviews`, {
      json: { rating: 5, comment: 'Great activity!' },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
    t.is(res.body.data.activityId, 106);
    t.is(res.body.data.rating, 5);
  } finally {
    server.close();
  }
});