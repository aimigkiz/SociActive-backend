// tests/responses.test.js
import test from 'ava';
import { successResponse, errorResponse } from '../utils/responses.js';

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    }
  };
}

// 1) successResponse με custom message/status
test('successResponse επιστρέφει σωστό payload με custom μήνυμα και status', t => {
  const res = createMockRes();

  successResponse(res, { id: 1 }, 'Custom', 201);

  t.is(res.statusCode, 201);
  t.deepEqual(res.body, {
    success: true,
    message: 'Custom',
    data: { id: 1 }
  });
});

// 2) successResponse με default μήνυμα & status
test('successResponse χρησιμοποιεί default message/status όταν δεν δίνονται', t => {
  const res = createMockRes();

  successResponse(res, { id: 2 }); // Χωρίς message, statusCode

  t.is(res.statusCode, 200);
  t.deepEqual(res.body, {
    success: true,
    message: 'Success',   // από τον κώδικά σου
    data: { id: 2 }
  });
});

// 3) errorResponse με Error object & NODE_ENV=development (στέλνει πλήρες error)
test('errorResponse στέλνει πλήρες error όταν NODE_ENV=development', t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const res = createMockRes();
  const err = new Error('Boom');

  errorResponse(res, err, 400);

  t.is(res.statusCode, 400);
  t.false(res.body.success);
  t.is(res.body.message, 'Boom');
  t.is(res.body.error, err);   // full error object

  process.env.NODE_ENV = prevEnv;
});

// 4) errorResponse με error χωρίς message & NODE_ENV≠development (fallback message, χωρίς error field)
test('errorResponse χρησιμοποιεί default μήνυμα και δεν εκθέτει error όταν δεν είναι development', t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  const res = createMockRes();
  const err = {}; // χωρίς message

  errorResponse(res, err);  // default statusCode = 500

  t.is(res.statusCode, 500);
  t.false(res.body.success);
  t.is(res.body.message, 'Internal Server Error'); // fallback από κώδικά σου
  t.is(res.body.error, undefined);                 // δεν στέλνεται error εκτός development

  process.env.NODE_ENV = prevEnv;
});