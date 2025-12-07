import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('DELETE cancelActivity → 404 όταν user δεν είναι host', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    // activity 101 έχει hostId = 1, άρα το 2 πρέπει να αποτύχει
    const res = await got.delete(`${url}/users/2/activities/101`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 404);
  } finally {
    server.close();
  }
});