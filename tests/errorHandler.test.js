// tests/errorHandler.test.js
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import express from 'express';
import got from 'got';
import { errorHandler } from '../middleware/errorHandler.js';

function createAppWithError(err) {
  const app = express();

  app.get('/boom', (req, res, next) => {
    next(err);
  });

  app.use(errorHandler);
  return app;
}

// 1) NODE_ENV != development → error είναι {}
test('errorHandler → 500 με generic error όταν NODE_ENV!=development', async t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';

  const err = new Error('Something broke');
  const app = createAppWithError(err);
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/boom`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 500);
    t.false(res.body.success);
    t.is(res.body.message, 'Something broke');
    t.deepEqual(res.body.error, {});  // από τον κώδικά σου
  } finally {
    process.env.NODE_ENV = prevEnv;
    server.close();
  }
});

// 2) NODE_ENV = development → στέλνει full err
test('errorHandler → 500 με πλήρες error όταν NODE_ENV=development', async t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const err = new Error('Debug me');
  const app = createAppWithError(err);
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/boom`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(res.statusCode, 500);
    t.false(res.body.success);
    t.is(res.body.message, 'Debug me');
    t.truthy(res.body.error);        // εδώ περιμένουμε να είναι το ίδιο το err
  } finally {
    process.env.NODE_ENV = prevEnv;
    server.close();
  }
});