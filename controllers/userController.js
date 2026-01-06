// controllers/userController.js
import * as DataService from '../services/dataService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// --- Friend & Notification ---

export const sendFriendRequest = async (req, res) => {
  try {
    const request = await DataService.createFriendRequest(req.params.userId, req.body.receiverId);
    successResponse(res, request, 'The friend request is sent successfully', 201);
  } catch (error) { errorResponse(res, error); }
};

export const sendNotification = async (req, res) => {
  try {
    const notification = await DataService.createNotification(req.params.userId, req.body.senderId, req.body.content, req.body.type);
    successResponse(res, notification, 'Notification successfully delivered', 201);
  } catch (error) { errorResponse(res, error); }
};

// --- Review & Rating ---

export const submitReview = async (req, res) => {
  try {
    const activity = await DataService.getActivityById(req.params.activityId);
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }
    if (!activity.completed) {
      const error = new Error("The activity hasn't been completed yet!");
      return errorResponse(res, error, 403);
    }
    
    const newReview = await DataService.createReview(req.params.userId, req.params.activityId, req.body);
    successResponse(res, newReview, 'Review successfully submitted', 201);
  } catch (error) { errorResponse(res, error); }
};

export const rateUser = async (req, res) => {
  try {
    const userRating = await DataService.createUserRating(req.params.userId, req.body.ratedUserId, req.body.rating);
    successResponse(res, userRating, 'Rating successfully submitted', 201);
  } catch (error) { errorResponse(res, error); }
};

// --- Profile & Participation Lists ---

export const getUserProfile = async (req, res) => {
  try {
    const profile = await DataService.getUserProfile(req.params.userId, req.params.profileId);
    if (!profile) {
      const error = new Error('User or profile not found');
      return errorResponse(res, error, 404);
    }
    successResponse(res, profile);
  } catch (error) { errorResponse(res, error); }
};

export const getParticipatingActivities = async (req, res) => {
  try {
    const activities = await DataService.getParticipatingActivities(req.params.userId);
    successResponse(res, activities, 'List of upcoming participating activities retrieved successfully');
  } catch (error) { errorResponse(res, error); }
};

export const getParticipatedActivities = async (req, res) => {
  try {
    const activities = await DataService.getParticipatedActivities(req.params.userId);
    successResponse(res, activities, 'List of completed activities retrieved successfully');
  } catch (error) { errorResponse(res, error); }
};

// --- Points ---

export const updatePoints = async (req, res) => {
  try {
    const result = await DataService.updatePoints(req.params.userId, req.body.addedPoints);
    if (!result) {
      const error = new Error('User not found');
      return errorResponse(res, error, 404);
    }
    successResponse(res, result, 'Points updated successfully');
  } catch (error) { errorResponse(res, error); }
};