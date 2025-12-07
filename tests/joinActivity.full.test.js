import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';
import * as DataService from '../services/dataService.js';

test('POST joinActivity → 400 όταν η δραστηριότητα είναι full', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  // πείραξε προσωρινά το mock
  const activity = await DataService.getActivityById(101);
  const originalMax = activity.details.maxParticipants;
  activity.details.maxParticipants = activity.participants.length; // full

  try {
    const res = await got.post(`${url}/users/5/activities/101/joinRequests`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 400);
    t.is(res.body.message, 'This activity has no available spots!');
  } finally {
    activity.details.maxParticipants = originalMax;
    server.close();
  }
});