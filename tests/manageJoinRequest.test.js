// tests/manageJoinRequest.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) 404 όταν το joinRequest δεν υπάρχει
test('PUT /users/:userId/activities/:activityId/joinRequests/:joinRequestId → 404 όταν δεν υπάρχει join request', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.put(
      `${url}/users/1/activities/101/joinRequests/999999`,
      {
        json: { status: 'accepted' },
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});

// 2) 200 όταν ενημερώνεται επιτυχώς (δημιουργούμε πρώτα join request)
test('PUT /users/:userId/activities/:activityId/joinRequests/:joinRequestId → 200 όταν ενημερώνεται επιτυχώς', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // ΒΗΜΑ 1: Δημιουργούμε join request
    const createRes = await got.post(
      `${url}/users/10/activities/101/joinRequests`,
      {
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(createRes.statusCode, 201);
    t.true(createRes.body.success);
    const joinRequest = createRes.body.data;
    const joinRequestId =
      joinRequest.joinRequestId || joinRequest.id || joinRequest._id;

    t.truthy(joinRequestId);

    // ΒΗΜΑ 2: Κάνουμε manage (π.χ. accept) το συγκεκριμένο join request
    const manageRes = await got.put(
      `${url}/users/1/activities/101/joinRequests/${joinRequestId}`,
      {
        json: { status: 'accepted' },
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(manageRes.statusCode, 200);
    t.true(manageRes.body.success);
    t.truthy(manageRes.body.data);
  } finally {
    server.close();
  }
});