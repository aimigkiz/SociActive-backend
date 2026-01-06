import * as DataService from '../services/dataService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * POST /users/:userId/activities/:activityId/reviews
 * Review a completed activity
 */
export const submitReview = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const { rating, comment } = req.body;

    // Validation
    if (!rating) {
      const error = new Error('Please rate the activity before submitting!');
      return errorResponse(res, error, 400);
    }

    // Word limit validation (mock limit of 50 words)
    if (comment && comment.split(' ').length > 50) {
      const error = new Error('Words limitation exceeded!');
      return errorResponse(res, error, 400);
    }

    // Check if activity exists and is completed
    const activity = await DataService.getActivityById(activityId);
    if (!activity) {
      const error = new Error('Activity not found');
      return errorResponse(res, error, 404);
    }

    if (!activity.completed) {
      const error = new Error("The activity hasn't been completed yet!");
      return errorResponse(res, error, 403);
    }

    const newReview = await DataService.createReview(userId, activityId, { rating, comment });
    successResponse(res, newReview, 'Thank you for your feedback!', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};