// controllers/activityController.js
import * as DataService from '../services/dataService.js';
import { successResponse, errorResponse } from '../utils/responses.js';


// --- Activity Retrieval & CRUD ---

export const getActivities = async (req, res) => {
  try {
    const activities = await DataService.getAllActivities(req.query);
    if (!activities || activities.length === 0) {
      return successResponse(res, [], 'No activities found');
    }
    successResponse(res, activities);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const hostActivity = async (req, res) => {
  try {
    const newActivity = await DataService.createActivity(
      req.params.userId,
      req.body
    );
    successResponse(res, newActivity, 'Activity hosted successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const getActivityPage = async (req, res) => {
  try {
    const activity = await DataService.getActivityViewById(
      req.params.activityId
    );
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: 'Activity not found' });
    successResponse(
      res,
      activity,
      'The chosen activity is accessed successfully'
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

export const cancelActivity = async (req, res) => {
  try {
    const activity = await DataService.getActivityById(req.params.activityId);
    if (
      !activity ||
      parseInt(activity.hostId) !== parseInt(req.params.userId)
    ) {
      return res
        .status(404)
        .json({ message: 'Activity not found or not authorized' });
    }
    await DataService.deleteActivity(req.params.activityId);
    res.status(204).send();
  } catch (error) {
    errorResponse(res, error);
  }
};

// --- Activity Details ---

export const getActivityDetails = async (req, res) => {
  try {
    const activity = await DataService.getActivityViewById(
      req.params.activityId
    );
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: 'Activity not found' });
    // Στέλνουμε ολόκληρο το flat activity object
    successResponse(res, activity);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const updateActivityDetails = async (req, res) => {
  try {
    const activity = await DataService.getActivityById(req.params.activityId);
    if (
      !activity ||
      parseInt(activity.hostId) !== parseInt(req.params.userId)
    ) {
      return res
        .status(404)
        .json({ message: 'Activity not found or not authorized' });
    }
    const updated = await DataService.updateActivity(
      req.params.activityId,
      req.body
    );
    successResponse(
      res,
      updated,
      'The details of the chosen activity are edited successfully'
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

// --- Participation & Management ---

// --- Participation & Management ---
// controllers/activityController.js

export const joinActivity = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const activityId = req.params.activityId;

    // ΠΑΝΤΑ raw mock activity (ΟΧΙ view!)
    const activity = await DataService.getActivityById(activityId);
    console.log('JOIN DEBUG activity:', activity); // <-- βοηθητικό log

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // 1) Έλεγχος αν ήδη συμμετέχεις
    if (activity.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You are already participating in this activity.' });
    }

    // 2) Έλεγχος χωρητικότητας (maxParticipants από details)
    const maxParticipants = Number(activity.details.maxParticipants);
    const current = activity.participants.length;
    console.log('JOIN DEBUG: current =', current, 'max =', maxParticipants);

    if (current >= maxParticipants) {
      return res
        .status(400)
        .json({ message: 'This activity has no available spots!' });
    }

    // 3) Δημιουργία join request
    const newRequest = await DataService.createJoinRequest(userId, activityId);
    successResponse(
      res,
      newRequest,
      'The join request is created successfully.',
      201
    );
  } catch (error) {
    errorResponse(res, error);
  }
};



export const manageJoinRequest = async (req, res) => {
  try {
    const updatedRequest = await DataService.manageJoinRequest(
      req.params.joinRequestId,
      req.body.status
    );
    if (!updatedRequest)
      return res.status(404).json({ message: 'Join-request not found' });
    successResponse(
      res,
      updatedRequest,
      'The status of the join request is changed successfully'
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

export const leaveActivity = async (req, res) => {
  try {
    const activity = await DataService.getActivityById(req.params.activityId);
    if (!activity)
      return res.status(404).json({ message: 'Activity not found' });
    if (activity.completed) {
      return res.status(400).json({
        message:
          "The activity has already started and the user can't leave"
      });
    }
    const deleted = await DataService.deleteParticipation(
      req.params.userId,
      req.params.activityId
    );
    if (!deleted)
      return res.status(404).json({ message: 'Participation not found' });
    res.status(204).send();
  } catch (error) {
    errorResponse(res, error);
  }
};

// --- Social Actions (Pins, Share, Message, Save) ---

export const pinActivity = async (req, res) => {
  try {
    const pin = await DataService.createPin(
      req.params.userId,
      req.params.activityId
    );
    successResponse(res, pin, 'The activity is pinned successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const shareActivity = async (req, res) => {
  try {
    const share = await DataService.createShare(
      req.params.userId,
      req.params.activityId,
      req.body.receiverIds
    );
    successResponse(res, share, 'The activity is shared successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const message = await DataService.createMessage(
      req.params.userId,
      req.params.activityId,
      req.body.messageContent
    );
    successResponse(res, message, 'The message is sent successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const saveActivity = async (req, res) => {
  try {
    const save = await DataService.createSave(
      req.params.userId,
      req.params.activityId
    );
    successResponse(res, save, 'The activity is saved successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const getPinnedActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const activities = await DataService.getPinnedActivities(userId);

    return successResponse(res, activities);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const unpinActivity = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const removed = await DataService.deletePin(userId, activityId);

    if (!removed) {
      return res
        .status(404)
        .json({ success: false, message: 'Pin not found' });
    }

    successResponse(res, removed, 'The activity is unpinned successfully');
  } catch (error) {
    errorResponse(res, error);
  }
};

