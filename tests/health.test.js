import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /api/health επιστρέφει status ok', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/api/health`, { responseType: 'json' });

    t.is(res.statusCode, 200);
    t.deepEqual(res.body, { status: 'ok' });
  } finally {
    server.close();
  }
});