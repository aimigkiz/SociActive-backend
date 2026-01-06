// controllers/activityController.js
import * as DataService from '../services/dataService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// --- Activity Retrieval & CRUD ---

export const getActivities = async (req, res) => {
  try {
    // 🎯 ΔΙΟΡΘΩΣΗ: Διαβάζουμε και τις δύο πιθανές ονομασίες για τη δυσκολία
    const { 
        type, 
        location, 
        dateFrom, 
        dateTo, 
        maxParticipants, 
        completed 
    } = req.query;

    // Προσπάθεια ανάγνωσης difficultyLevel Η difficulty (για ασφάλεια)
    const difficultyParam = req.query.difficultyLevel || req.query.difficulty;

    const filters = {
        type: type ? String(type).trim() : undefined,
        location: location ? String(location).trim() : undefined,
        
        // Περνάμε όποιο από τα δύο βρέθηκε
        difficultyLevel: difficultyParam ? String(difficultyParam).trim() : undefined,
        
        dateFrom: dateFrom ? String(dateFrom).trim() : undefined,
        dateTo: dateTo ? String(dateTo).trim() : undefined,
        completed: completed ? String(completed).trim() : undefined,
        maxParticipants: maxParticipants ? String(maxParticipants).trim() : undefined,
    };
    
    const activities = await DataService.getAllActivities(filters);
    
    // Αν δεν βρεθούν, επιστρέφουμε κενό array (200 OK) αντί για error, είναι πιο σωστό για φίλτρα
    successResponse(res, activities || []);
  } catch (error) {
    console.error('Filter Error:', error);
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
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }
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
      const error = new Error('Activity not found or not authorized');
      return errorResponse(res, error, 404);
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
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }
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
      const error = new Error('Activity not found or not authorized');
      return errorResponse(res, error, 404);
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

export const joinActivity = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const activityId = req.params.activityId;

    const activity = await DataService.getActivityById(activityId);

    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }

    if (activity.participants.includes(userId)) {
      const error = new Error('You are already participating in this activity.');
      return errorResponse(res, error, 400);
    }

    const maxParticipants = Number(activity.details.maxParticipants);
    const current = activity.participants.length;

    if (current >= maxParticipants) {
      const error = new Error('This activity has no available spots!');
      return errorResponse(res, error, 400);
    }

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
    if (!updatedRequest) {
      const error = new Error('Join-request not found');
      return errorResponse(res, error, 404);
    }
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
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }
    if (activity.completed) {
      const error = new Error("The activity has already started and the user can't leave");
      return errorResponse(res, error, 400);
    }
    const deleted = await DataService.deleteParticipation(
      req.params.userId,
      req.params.activityId
    );
    if (!deleted) {
      const error = new Error('Participation not found');
      return errorResponse(res, error, 404);
    }
    res.status(204).send();
  } catch (error) {
    errorResponse(res, error);
  }
};

// --- Social Actions ---

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
      const error = new Error('Pin not found');
      return errorResponse(res, error, 404);
    }
    successResponse(res, removed, 'The activity is unpinned successfully');
  } catch (error) {
    errorResponse(res, error);
  }
};