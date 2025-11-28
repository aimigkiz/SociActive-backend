// routes/activityRoutes.js
import express from 'express';
import { 
    getActivities, hostActivity, getActivityDetails, updateActivityDetails, 
    cancelActivity, joinActivity, pinActivity, shareActivity, sendMessage, 
    leaveActivity, saveActivity, manageJoinRequest, getActivityPage,
    getPinnedActivities, unpinActivity
} from '../controllers/activityController.js';

// Import review function from userController (for clean separation)
import { submitReview } from '../controllers/userController.js'; 

const router = express.Router({ mergeParams: true });

// PATH: /users/{userId}/activities
router.get('/', getActivities); 
router.post('/', hostActivity);

// PATH: /users/{userId}/activities/pinned
router.get('/pinned', getPinnedActivities);

// PATH: /users/{userId}/activities/{activityId} (FR 21, 29)
router.get('/:activityId', getActivityPage); 
router.delete('/:activityId', cancelActivity);

// PATH: /users/{userId}/activities/{activityId}/details (FR 4, 19)
router.get('/:activityId/details', getActivityDetails); 
router.put('/:activityId/details', updateActivityDetails);

// PATH: /users/{userId}/activities/{activityId}/joinRequests (FR 5)
router.post('/:activityId/joinRequests', joinActivity); 

// PATH: /users/{userId}/activities/{activityId}/joinRequests/{joinRequestId} (FR 18)
router.put('/:activityId/joinRequests/:joinRequestId', manageJoinRequest); 

// PATH: /users/{userId}/activities/{activityId}/pins (pin & unpin)
router.post('/:activityId/pins', pinActivity);
router.delete('/:activityId/pins', unpinActivity);

// PATH: /users/{userId}/activities/{activityId}/shares (FR 9)
router.post('/:activityId/shares', shareActivity); 

// PATH: /users/{userId}/activities/{activityId}/chats/messages (FR 11)
router.post('/:activityId/chats/messages', sendMessage); 

// PATH: /users/{userId}/activities/{activityId}/participations/{participationId} (FR 12)
router.delete('/:activityId/participations/:participationId', leaveActivity); 

// PATH: /users/{userId}/activities/{activityId}/reviews (FR 14)
router.post('/:activityId/reviews', submitReview); 

// PATH: /users/{userId}/activities/{activityId}/saves (FR 16)
router.post('/:activityId/saves', saveActivity); 

export default router;