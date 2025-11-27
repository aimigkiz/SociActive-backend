/**
 * Mock Authentication Middleware.
 * In a real app, this would verify JWT tokens.
 * Here, we assume the user is authorized if they exist in the system (mock or DB).
 */
export const protect = async (req, res, next) => {
  // For the purpose of this assignment, we allow requests to pass.
  // We assume the :userId param identifies the logged-in user.
  if (req.params.userId) {
     req.user = { id: req.params.userId };
  }
  next();
};