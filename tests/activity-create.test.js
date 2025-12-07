// tests/activity-create.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) POST /users/:userId/activities → δημιουργία activity (success branch)
test('POST /users/:userId/activities → 201 όταν η activity δημιουργείται επιτυχώς', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/activities`, {
      json: {
        activityType: 'Test',
        date: [1, 1, 2025],
        location: 'Somewhere',
        maxParticipants: 5,
        difficultyLevel: 'Beginner',
        equipment: ['A'],
        time: '10:00'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
    t.truthy(res.body.data.activityId);
  } finally {
    server.close();
  }
});

// 2) GET /users/:userId/activities?completed=false → επιτυχημένο list (success branch getAllActivities)
test('GET /users/:userId/activities?completed=false → 200 και λίστα activities', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?completed=false`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.true(Array.isArray(res.body.data));
  } finally {
    server.close();
  }
});

// 3) POST /users/:userId/friendRequests → επιτυχημένο friend request (success branch sendFriendRequest)
test('POST /users/:userId/friendRequests → 201 όταν αποστέλλεται επιτυχώς', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/friendRequests`, {
      json: { receiverId: 2 },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
  } finally {
    server.close();
  }
});

// 4) POST /users/:userId/notifications → επιτυχημένη ειδοποίηση (success branch sendNotification)
test('POST /users/:userId/notifications → 201 όταν η ειδοποίηση αποστέλλεται', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.post(`${url}/users/1/notifications`, {
      json: { senderId: 2, content: 'Hi', type: 'info' },
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 201);
    t.true(res.body.success);
  } finally {
    server.close();
  }
});

// 5) GET /users/:userId/participatingActivities → success branch getParticipatingActivities
test('GET /users/:userId/participatingActivities → 200 και λίστα upcoming activities', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/participatingActivities`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.true(Array.isArray(res.body.data));
  } finally {
    server.close();
  }
});

// 6) GET /users/:userId/participatedActivities → success branch getParticipatedActivities
test('GET /users/:userId/participatedActivities → 200 και λίστα completed activities', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/participatedActivities`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
    t.true(Array.isArray(res.body.data));
  } finally {
    server.close();
  }
});