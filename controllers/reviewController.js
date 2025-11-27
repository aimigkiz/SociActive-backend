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
      return res.status(400).json({ success: false, message: 'Please rate the activity before submitting!' });
    }

    // Word limit validation (mock limit of 50 words)
    if (comment && comment.split(' ').length > 50) {
      return res.status(400).json({ success: false, message: 'Words limitation exceeded!' });
    }

    // Check if activity exists and is completed
    const activity = await DataService.getActivityById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    if (!activity.completed) {
      return res.status(403).json({ success: false, message: "The activity hasn't been completed yet!" });
    }

    const newReview = await DataService.createReview(userId, activityId, { rating, comment });
    successResponse(res, newReview, 'Thank you for your feedback!', 201);
  } catch (error) {
    errorResponse(res, error);
  }
};