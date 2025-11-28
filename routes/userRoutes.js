// routes/userRoutes.js
import express from 'express';
import { 
    sendFriendRequest, sendNotification, rateUser, updatePoints,
    getUserProfile, getParticipatingActivities, getParticipatedActivities
} from '../controllers/userController.js';

const router = express.Router({ mergeParams: true });

// PATH: /users/{userId}/friendRequests (FR 8)
router.post('/friendRequests', sendFriendRequest); 

// PATH: /users/{userId}/notifications (FR 13)
router.post('/notifications', sendNotification); 

// PATH: /users/{userId}/userRatings (FR 15)
router.post('/userRatings', rateUser); 

// PATH: /users/{userId}/points (FR 22)
router.put('/points', updatePoints); 

// PATH: /users/{userId}/profiles/{profileId} (FR 28, 31)
router.get('/profiles/:profileId', getUserProfile); 

// PATH: /users/{userId}/participatingActivities (FR 32)
router.get('/participatingActivities', getParticipatingActivities); 

// PATH: /users/{userId}/participatedActivities (FR 33)
router.get('/participatedActivities', getParticipatedActivities); 

export default router;