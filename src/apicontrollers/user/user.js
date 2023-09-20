// userRouter.js

import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import userValidationSchema from '../requestValidaton/user.js';
import validatePagination from '../../utils/assets/paginateValidation.js'; // Import the custom pagination validation middleware
import userService from '../../services/user/user.js';

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

// Route for getting a user by their ID
userRouter.get('/:userId', async (req, res) => {
  // logic for getting user by id
});

// Route for updating a user by their ID
userRouter.put('/:userId', userValidationSchema, validateErrors, async (req, res) => {
  // logic for updating user by id

});

// Route for deleting a user by their ID
userRouter.delete('/:userId', async (req, res) => {
  // logic for deleting user by id
  
});

export default userRouter;
