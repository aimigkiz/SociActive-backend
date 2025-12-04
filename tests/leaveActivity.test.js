// tests/leaveActivity.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';
import * as DataService from '../services/dataService.js';

// 1) 404 όταν δεν υπάρχει activity
test('DELETE /users/:userId/activities/:activityId/participations/:id → 404 όταν δεν υπάρχει activity', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.delete(
      `${url}/users/1/activities/999999/participations/1`,
      {
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Activity not found');
  } finally {
    server.close();
  }
});

// 2) 400 όταν activity.completed === true
test('DELETE → 400 όταν activity.completed === true', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  // Πειράζουμε προσωρινά το mock activity
  const activity = await DataService.getActivityById(101);
  const original = activity.completed;
  activity.completed = true;

  try {
    const res = await got.delete(
      `${url}/users/1/activities/101/participations/1`,
      {
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(res.statusCode, 400);
  } finally {
    // επαναφορά
    activity.completed = original;
    server.close();
  }
});

test('DELETE → 400 όταν το participation είναι μη έγκυρο', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.delete(
      `${url}/users/1/activities/101/participations/999999`,
      {
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 400);
  } finally {
    server.close();
  }
});

// 4) 400 όταν ο χρήστης προσπαθεί να φύγει (δεν επιτρέπεται)
test('DELETE → 400 όταν ο χρήστης αποχωρεί (δεν επιτρέπεται)', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.delete(
      `${url}/users/1/activities/101/participations/1`,
      {
        responseType: 'json',
        throwHttpErrors: false,
      }
    );

    t.is(res.statusCode, 400);
  } finally {
    server.close();
  }
});