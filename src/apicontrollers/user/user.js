// userRouter.js

import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import userValidationSchema from '../requestValidaton/user.js';
import validatePagination from '../../utils/assets/paginateValidation.js'; // Import the custom pagination validation middleware
import userService from '../../services/user/user.js';
import * as userService from '../../services/userService';


const userRouter = express.Router();
const { validateErrors, apikok } = apiHelpers;

// Route for registering a new user
userRouter.post('/register', userValidationSchema, validateErrors, async (req, res) => {
  const body = req.body;
  const result = await userService.createUser(body);
  const response = apikok(result);
  res.json(response);
});

// Route for getting a list of users with pagination support
userRouter.get('/', validatePagination, userValidationSchema, validateErrors, async (req, res) => {
  let { page, perPage } = req.query;
  // Set default values if page and/or perPage are not provided
  page = page || 1;
  perPage = perPage || 10;
  const result = await userService.getAllUsers(page, perPage);
  const response = apikok(result);
  res.json(response);
});

userRouter.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(apikok(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


userRouter.put('/:userId', userValidationSchema, validateErrors, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userId, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(apikok(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for deleting a user by their ID
userRouter.delete('/:userId', async (req, res) => {
  // logic for deleting user by id
  
});

export default userRouter;
