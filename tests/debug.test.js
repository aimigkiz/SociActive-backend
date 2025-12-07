import test from 'ava';
import * as DataService from '../services/dataService.js';

test('print first mock activity', async t => {
  const act = await DataService.getActivityById("101");
  console.log("DEBUG ACTIVITY:", act);
  t.pass();
});