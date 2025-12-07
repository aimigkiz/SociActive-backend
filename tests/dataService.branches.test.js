import test from 'ava';
import * as DataService from '../services/dataService.js';

// 1) updateActivity / deleteActivity όταν το activity δεν υπάρχει
test('updateActivity επιστρέφει null όταν το activity δεν υπάρχει', async t => {
  const updated = await DataService.updateActivity(999999, { location: 'Nowhere' });
  t.is(updated, null);
});

test('deleteActivity επιστρέφει null όταν το activity δεν υπάρχει', async t => {
  const deleted = await DataService.deleteActivity(999999);
  t.is(deleted, null);
});

// 2) manageJoinRequest όταν το joinRequestId δεν υπάρχει
test('manageJoinRequest επιστρέφει null όταν το joinRequest δεν υπάρχει', async t => {
  const res = await DataService.manageJoinRequest(123456, 'accepted');
  t.is(res, null);
});

// 3) deleteParticipation όταν ο user ΔΕΝ συμμετέχει στο activity
test('deleteParticipation επιστρέφει false όταν ο user δεν συμμετέχει', async t => {
  const result = await DataService.deleteParticipation(5, 101); // 5 δεν είναι στους participants του 101
  t.false(result);
});

// 4) deletePin όταν δεν υπάρχει pin για τον user/activity
test('deletePin επιστρέφει null όταν δεν υπάρχει αντίστοιχο pin', async t => {
  const result = await DataService.deletePin(2, 101); // userId 2 δεν έχει pins
  t.is(result, null);
});

// 5) createFriendRequest όταν είναι ήδη φίλοι (να χτυπήσουμε το αρνητικό branch)
test('createFriendRequest δεν διπλο-προσθέτει φίλους αν είναι ήδη φίλοι', async t => {
  // 1 και 2 είναι ήδη φίλοι από τα mock δεδομένα
  const beforeSender = (await DataService.getUserProfile(1, 1)).friendIds.length;
  const beforeReceiver = (await DataService.getUserProfile(2, 2)).friendIds.length;

  await DataService.createFriendRequest(1, 2);

  const afterSender = (await DataService.getUserProfile(1, 1)).friendIds.length;
  const afterReceiver = (await DataService.getUserProfile(2, 2)).friendIds.length;

  t.is(afterSender, beforeSender);
  t.is(afterReceiver, beforeReceiver);
});

// 6) getPinnedActivities όταν ο χρήστης δεν έχει καθόλου pins
test('getPinnedActivities επιστρέφει [] όταν ο χρήστης δεν έχει pins', async t => {
  const activities = await DataService.getPinnedActivities(2); // μόνο ο 1 έχει pins στα mock
  t.true(Array.isArray(activities));
  t.is(activities.length, 0);
});

// 7) getUserProfile όταν ο χρήστης δεν υπάρχει
test('getUserProfile επιστρέφει null όταν ο χρήστης δεν υπάρχει', async t => {
  const profile = await DataService.getUserProfile(1, 999999);
  t.is(profile, null);
});

// 8) getUserProfile όταν ζητάς προφίλ ΑΛΛΟΥ χρήστη (όχι self)
test('getUserProfile για άλλον χρήστη επιστρέφει baseProfile χωρίς friendIds/pins', async t => {
  const profile = await DataService.getUserProfile(1, 2); // 1 βλέπει το προφίλ του 2
  t.is(profile.userId, 2);
  t.is(profile.profileId, 2);
  t.truthy(profile.username);
  t.falsy(profile.friendIds);       // δεν πρέπει να υπάρχουν friendIds, pinned κλπ.
});

// 9) getParticipatingActivities επιστρέφει μόνο μη completed
test('getParticipatingActivities επιστρέφει μόνο upcoming activities', async t => {
  const list = await DataService.getParticipatingActivities(1);
  t.true(Array.isArray(list));
  t.true(list.every(a => a.completed === false));
});

// 10) getParticipatedActivities επιστρέφει μόνο completed
test('getParticipatedActivities επιστρέφει μόνο completed activities', async t => {
  const list = await DataService.getParticipatedActivities(1);
  t.true(Array.isArray(list));
  t.true(list.every(a => a.completed === true));
});