import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) GET /users/:userId/activities/:activityId/details → 200 όταν το activity υπάρχει
test('GET /users/:userId/activities/:activityId/details → 200 όταν το activity υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // Στα mock, activityId 101 υπάρχει
    const res = await got(`${url}/users/1/activities/101/details`, {
      responseType: 'json'
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.is(res.body.data.activityId, 101);
  } finally {
    server.close();
  }
});

// 2) PUT /users/:userId/activities/:activityId/details → 200 όταν ο host ενημερώνει επιτυχώς
test('PUT /users/:userId/activities/:activityId/details → 200 όταν ο host ενημερώνει επιτυχώς', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * activityId 101 έχει hostId = 1
   * Άρα userId = 1 είναι εξουσιοδοτημένος να κάνει update.
   */
  try {
    const res = await got.put(`${url}/users/1/activities/101/details`, {
      json: { location: 'Updated Location' },
      responseType: 'json'
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.is(res.body.data.details.location, 'Updated Location');
  } finally {
    server.close();
  }
});

// 3) DELETE /users/:userId/activities/:activityId/pins → 200 όταν το pin υπάρχει (success branch)
test('DELETE /users/:userId/activities/:activityId/pins → 200 όταν το pin υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * Στα mockPins:
   *   { pinId: 1, userId: 1, activityId: 101 },
   *   { pinId: 2, userId: 1, activityId: 103 }
   * Άρα ο user 1 έχει pin για activityId 101.
   */
  try {
    const res = await got.delete(`${url}/users/1/activities/101/pins`, {
      responseType: 'json'
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.is(res.body.message, 'The activity is unpinned successfully');
  } finally {
    server.close();
  }
});