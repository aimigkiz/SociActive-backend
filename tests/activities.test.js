// tests/activities.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /users/:userId/activities επιστρέφει επιτυχημένο JSON response', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // 1) Δεν θέλουμε σφάλμα server
    t.is(res.statusCode, 200);

    // Τυπικό pattern για successResponse:
    // { success: true, data: [...], message: '...' }
    t.true(typeof res.body === 'object');
    t.true(res.body.success);             // success: true
    t.true(Array.isArray(res.body.data)); // data: array
    // προαιρετικά: t.truthy(res.body.message);
  } finally {
    server.close();
  }
});


test('GET /users/:userId/activities/:activityId επιστρέφει σελίδα activity', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // 1) Παίρνουμε τη λίστα των activities
    const listRes = await got(`${url}/users/1/activities`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(listRes.statusCode, 200);
    t.true(Array.isArray(listRes.body.data));

    const firstActivity = listRes.body.data[0];
    t.truthy(firstActivity);

    // Προσπάθεια να βρούμε το id (προσαρμόζεις αν έχεις διαφορετικό πεδίο)
    const activityId =
      firstActivity.activityId || firstActivity.id || firstActivity._id;

    t.truthy(activityId);

    // 2) Καλούμε GET /users/1/activities/:activityId
    const pageRes = await got(`${url}/users/1/activities/${activityId}`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(pageRes.statusCode, 200);
    t.true(pageRes.body.success);
    t.truthy(pageRes.body.data);
  } finally {
    server.close();
  }
});

test('GET /users/:userId/activities/:activityId για ανύπαρκτο activity επιστρέφει 404', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // Χρησιμοποιούμε ένα "απίθανο" id που να μην υπάρχει
    const res = await got(`${url}/users/1/activities/999999`, {
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