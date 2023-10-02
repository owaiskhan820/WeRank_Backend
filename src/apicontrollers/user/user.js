// userRouter.js

import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import userValidationSchema from '../requestValidaton/user.js';
import validatePagination from '../../utils/assets/paginateValidation.js'; // Import the custom pagination validation middleware
import userService from '../../services/user/user.js';
import { verifyEmail } from '../../authentication/emailVarification.js';

const authRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;

// Route for registering a new user
authRouter.post('/register', userValidationSchema, validateErrors, async (req, res) => {
  const body = req.body;
  const result = await userService.createUser(body);
  const response = apiOk(result);
  res.json(response);
});


authRouter.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  verifyEmail(token, res)
});


// Route for getting a list of users with pagination support
authRouter.get('/', validatePagination, userValidationSchema, validateErrors, async (req, res) => {
  let { page, perPage } = req.query;
  // Set default values if page and/or perPage are not provided
  page = page || 1;
  perPage = perPage || 10;
  const result = await userService.getAllUsers(page, perPage);
  const response = apiOk(result);
  res.json(response);
});

// 3. Forgot Password:
authRouter.post('/forgot-password', async (req, res) => {
  try {
    // Validate request body
    // Generate password reset token and save it
    // Send password reset email
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 4. Reset Password:

authRouter.post('/reset-password', async (req, res) => {
  try {
    // Validate request body and token
    // Reset user's password
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

// 6. Logout:
 
authRouter.post('/logout', async (req, res) => {
  try {
    // Invalidate user's session or token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default authRouter;
