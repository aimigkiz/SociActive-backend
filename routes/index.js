// routes/index.js
import express from 'express';
import activityRoutes from './activityRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router({ mergeParams: true });

// Όλες οι διαδρομές που αφορούν activities:
// /users/:userId/activities/...
router.use('/users/:userId/activities', activityRoutes);

// Όλες οι υπόλοιπες user διαδρομές:
// /users/:userId/participatingActivities
// /users/:userId/participatedActivities
// /users/:userId/profiles/:profileId
// /users/:userId/friendRequests
// κ.λπ.
router.use('/users/:userId', userRoutes);

export default router;
