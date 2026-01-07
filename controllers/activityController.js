// controllers/activityController.js
import * as DataService from '../services/dataService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// Minimal input validation helpers - targeted fixes without breaking tests
const sanitizeString = (value) => {
  return value ? String(value).trim() : undefined;
};

const validatePositiveInteger = (value, fieldName) => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return num;
};

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
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const newActivity = await DataService.createActivity(
      userId,
      req.body
    );
    successResponse(res, newActivity, 'Activity hosted successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const getActivityPage = async (req, res) => {
  try {
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const activity = await DataService.getActivityViewById(activityId);
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
    const activityId = sanitizeString(req.params.activityId);
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activity = await DataService.getActivityById(activityId);
    if (
      !activity ||
      parseInt(activity.hostId, 10) !== userId
    ) {
      const error = new Error('Activity not found or not authorized');
      return errorResponse(res, error, 404);
    }
    await DataService.deleteActivity(activityId);
    res.status(204).send();
  } catch (error) {
    errorResponse(res, error);
  }
};

// --- Activity Details ---

export const getActivityDetails = async (req, res) => {
  try {
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const activity = await DataService.getActivityViewById(activityId);
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
    const activityId = sanitizeString(req.params.activityId);
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    if (!req.body || typeof req.body !== 'object') {
      throw new Error('Request body must be provided');
    }
    const activity = await DataService.getActivityById(activityId);
    if (
      !activity ||
      parseInt(activity.hostId, 10) !== userId
    ) {
      const error = new Error('Activity not found or not authorized');
      return errorResponse(res, error, 404);
    }
    const updated = await DataService.updateActivity(activityId, req.body);
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
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');

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
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      throw new Error('Invalid maxParticipants value');
    }
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
    const joinRequestId = sanitizeString(req.params.joinRequestId);
    if (!joinRequestId) throw new Error('joinRequestId is required');
    const status = req.body?.status;
    if (!status) throw new Error('status is required in request body');
    const validatedStatus = sanitizeString(status);
    const updatedRequest = await DataService.manageJoinRequest(
      joinRequestId,
      validatedStatus
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
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const activity = await DataService.getActivityById(activityId);
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }
    if (activity.completed) {
      const error = new Error("The activity has already started and the user can't leave");
      return errorResponse(res, error, 400);
    }
    const deleted = await DataService.deleteParticipation(userId, activityId);
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
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const pin = await DataService.createPin(userId, activityId);
    successResponse(res, pin, 'The activity is pinned successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const shareActivity = async (req, res) => {
  try {
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const receiverIds = req.body?.receiverIds;
    if (!receiverIds) throw new Error('receiverIds is required in request body');
    if (!Array.isArray(receiverIds)) throw new Error('receiverIds must be an array');
    const share = await DataService.createShare(userId, activityId, receiverIds);
    successResponse(res, share, 'The activity is shared successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const messageContent = req.body?.messageContent;
    if (!messageContent) throw new Error('messageContent is required in request body');
    const validatedContent = sanitizeString(messageContent);
    if (!validatedContent || validatedContent.length === 0) throw new Error('messageContent cannot be empty');
    const message = await DataService.createMessage(
      userId,
      activityId,
      validatedContent
    );
    successResponse(res, message, 'The message is sent successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const saveActivity = async (req, res) => {
  try {
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
    const save = await DataService.createSave(userId, activityId);
    successResponse(res, save, 'The activity is saved successfully', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const getPinnedActivities = async (req, res) => {
  try {
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activities = await DataService.getPinnedActivities(userId);
    return successResponse(res, activities);
  } catch (error) {
    errorResponse(res, error);
  }
};

export const unpinActivity = async (req, res) => {
  try {
    const userId = validatePositiveInteger(req.params.userId, 'userId');
    const activityId = sanitizeString(req.params.activityId);
    if (!activityId) throw new Error('activityId is required');
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