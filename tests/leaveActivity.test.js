// tests/leaveActivity.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

/**
 * Ελέγχουμε τη συμπεριφορά του controller leaveActivity:
 *
 * 1. 404 όταν το activity δεν υπάρχει
 * 2. 400 όταν το activity είναι completed (δεν επιτρέπεται να φύγεις)
 * 3. 404 όταν δεν υπάρχει participation για τον συγκεκριμένο χρήστη
 * 4. 204 όταν ο χρήστης αποχωρεί επιτυχώς
 *
 * Προσοχή: το participationId στο URL δεν χρησιμοποιείται μέσα στο DataService,
 * απλώς το περνάμε για να ταιριάζει με το REST path.
 */

// 1) 404 όταν το activity δεν υπάρχει
test('leaveActivity → DELETE → 404 όταν το activity δεν υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.delete(
      `${url}/users/1/activities/999999/participations/1`,
      {
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

// 2) 400 όταν το activity είναι completed (δεν επιτρέπεται να φύγεις)
test('leaveActivity → DELETE → 400 όταν το activity είναι completed', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * Στα mock δεδομένα:
   * activityId 102:
   *   completed: true
   *   participants: [2, 1, 8]
   * Άρα ο userId 2 συμμετέχει σε completed activity.
   */
  try {
    const res = await got.delete(
      `${url}/users/2/activities/102/participations/2`,
      {
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 400);
    t.is(
      res.body.message,
      "The activity has already started and the user can't leave"
    );
  } finally {
    server.close();
  }
});

// 3) 404 όταν δεν υπάρχει participation για τον συγκεκριμένο χρήστη
test('leaveActivity → DELETE → 404 όταν δεν υπάρχει participation για τον χρήστη', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * Στα mock δεδομένα:
   * activityId 101:
   *   participants: [1, 2, 3, 7]
   * Ο userId 4 ΔΕΝ συμμετέχει, άρα deleteParticipation → false
   * και ο controller πρέπει να επιστρέψει 404 "Participation not found".
   */
  try {
    const res = await got.delete(
      `${url}/users/4/activities/101/participations/4`,
      {
        responseType: 'json',
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 404);
    t.is(res.body.message, 'Participation not found');
  } finally {
    server.close();
  }
});

// 4) 204 όταν ο χρήστης αποχωρεί επιτυχώς
test('leaveActivity → DELETE → 204 όταν ο χρήστης αποχωρεί επιτυχώς', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  /**
   * activityId 101 (completed: false)
   *   participants: [1, 2, 3, 7]
   * Ο userId 1 είναι συμμετέχων σε μη completed activity,
   * άρα η αποχώρηση πρέπει να είναι επιτυχής → 204.
   */
  try {
    const res = await got.delete(
      `${url}/users/1/activities/101/participations/1`,
      {
        throwHttpErrors: false
      }
    );

    t.is(res.statusCode, 204);
  } finally {
    server.close();
  }
});