import test from 'ava';
import { errorResponse } from '../utils/responses.js';

// Μικρό mock της Express response
const createResMock = () => {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
};

test('errorResponse σε development περιλαμβάνει το error object', t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const res = createResMock();
  const err = new Error('Dev error');

  errorResponse(res, err, 500);

  t.is(res.statusCode, 500);
  t.false(res.body.success);
  t.is(res.body.message, 'Dev error');
  t.truthy(res.body.error);        // εδώ περιμένουμε να υπάρχει το error object

  process.env.NODE_ENV = prevEnv;
});

test('errorResponse εκτός development ΔΕΝ επιστρέφει error object', t => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production'; // οτιδήποτε != 'development'

  const res = createResMock();
  const err = new Error('Prod error');

  errorResponse(res, err, 500);

  t.is(res.statusCode, 500);
  t.false(res.body.success);
  t.is(res.body.message, 'Prod error');
  t.is(res.body.error, undefined); // εδώ ΔΕΝ θέλουμε error object

  process.env.NODE_ENV = prevEnv;
});