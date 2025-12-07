import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('DELETE /users/:userId/activities/:activityId/pins → 200 unpinned όταν το pin υπάρχει', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // πρώτα κάνουμε pin για να είμαστε σίγουροι ότι υπάρχει
    await got.post(`${url}/users/1/activities/101/pins`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    const res = await got.delete(`${url}/users/1/activities/101/pins`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 200);
    t.true(res.body.success);
  } finally {
    server.close();
  }
});

test('DELETE /users/:userId/activities/:activityId/pins → 404 όταν δεν υπάρχει pin', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got.delete(`${url}/users/1/activities/999999/pins`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});