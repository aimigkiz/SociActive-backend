import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// 1) completed = true
test('GET /users/1/activities?completed=true → returns only completed', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?completed=true`, {
      responseType: 'json'
    });

    t.true(res.body.data.every(a => a.completed === true));
  } finally {
    server.close();
  }
});

// 2) completed = false
test('GET /users/1/activities?completed=false → returns only upcoming', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?completed=false`, {
      responseType: 'json'
    });

    t.true(res.body.data.every(a => a.completed === false));
  } finally {
    server.close();
  }
});

// 3) type filter
test('GET /users/1/activities?type=Hiking → filters correctly by type', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?type=Hiking`, {
      responseType: 'json'
    });

    t.true(res.body.data.every(a => a.details.activityType === 'Hiking'));
  } finally {
    server.close();
  }
});

// 4) location substring filter
test('GET /users/1/activities?location=Thessaloniki → substring match', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?location=Thessaloniki`, {
      responseType: 'json'
    });

    t.true(
      res.body.data.every(a =>
        a.details.location.toLowerCase().includes('thessaloniki'.toLowerCase())
      )
    );
  } finally {
    server.close();
  }
});

// 5) difficulty filter
test('GET /users/1/activities?difficultyLevel=Beginner → filters by difficulty', async t => {
  const server = http.createServer(app);
  const url = await listen(server);

  try {
    const res = await got(`${url}/users/1/activities?difficultyLevel=Beginner`, {
      responseType: 'json'
    });

    t.true(res.body.data.every(a => a.details.difficultyLevel === 'Beginner'));
  } finally {
    server.close();
  }
});