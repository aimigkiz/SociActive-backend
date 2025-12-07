// tests/userErrors.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) getUserProfile → 404 όταν user/profile δεν υπάρχουν
test('GET /users/:userId/profiles/:profileId → 404 όταν δεν υπάρχει user/profile', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/9999/profiles/9999`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
    t.false(res.body.success);
    t.is(res.body.message, 'User or profile not found');
  } finally {
    server.close();
  }
});

// 2) submitReview → 404 όταν activity δεν υπάρχει
test('POST /users/:userId/activities/:activityId/reviews → 404 όταν activity δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(
      `${url}/users/1/activities/999999/reviews`,
      {
        json: { rating: 5, comment: 'Nice' },
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

// 3) submitReview → 403 όταν activity δεν έχει ολοκληρωθεί
test("POST /users/:userId/activities/:activityId/reviews → 403 όταν η activity δεν είναι completed", async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // βασίζομαι στο ότι η 101 είναι completed=false στα mock σου (όπως είχες δείξει πριν)
    const res = await got.post(
      `${url}/users/1/activities/101/reviews`,
      {
        json: { rating: 4, comment: 'Good' },
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

// 4) updatePoints → 404 όταν user δεν υπάρχει
test('PUT /users/:userId/points → 404 όταν user δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(`${url}/users/9999/points`, {
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