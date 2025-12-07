import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) GET /users/:userId/profiles/:profileId → 404 όταν δεν υπάρχει χρήστης/προφίλ
test('GET /users/:userId/profiles/:profileId → 404 όταν δεν υπάρχει προφίλ', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/profiles/999999`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.success, false);
    t.is(res.body.message, 'User or profile not found');
  } finally {
    server.close();
  }
});

// 2) PUT /users/:userId/points → 404 όταν ο χρήστης δεν υπάρχει
test('PUT /users/:userId/points → 404 όταν ο χρήστης δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/999999/points`, {
      json: { addedPoints: 10 },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'User not found');
  } finally {
    server.close();
  }
});

// 3) POST /users/:userId/activities/:activityId/reviews → 404 όταν το activity δεν υπάρχει
test('POST /users/:userId/activities/:activityId/reviews → 404 όταν το activity δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(
      `${url}/users/1/activities/999999/reviews`,
      {
        json: { rating: 5, comment: 'Test review' },
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Activity not found');
  } finally {
    server.close();
  }
});

// 4) POST /users/:userId/activities/:activityId/reviews → 403 όταν το activity δεν έχει ολοκληρωθεί
test('POST /users/:userId/activities/:activityId/reviews → 403 όταν το activity δεν έχει ολοκληρωθεί', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  // Στα mock data, το 101 είναι completed: false
  try {
    const res = await got.post(
      `${url}/users/1/activities/101/reviews`,
      {
        json: { rating: 4, comment: 'Too early review' },
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 403);
    t.is(res.body.message, "The activity hasn't been completed yet!");
  } finally {
    server.close();
  }
});