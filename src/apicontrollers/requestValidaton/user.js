import { body } from 'express-validator';
import UserModel from '../../models/user/user.js';

import instanceOfUserDAO from '../../daos/user/user.js';

export const userValidationSchema = [


  body('firstName')
    .exists().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .notEmpty().withMessage('First name cannot be empty'),

  body('lastName')
    .exists().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .notEmpty().withMessage('Last name cannot be empty'),

  body('username')
    .exists().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^\w+$/).withMessage('Username must contain only letters, numbers, and underscores')
    
    .custom(async (value, { req }) => {
      // Check if username already exists in the database
      const user = await UserModel.findOne({ username: value });
      if (user) {
        // If username already exists, throw an error
        throw new Error('Username is already taken');
      }
      // If username does not exist, validation passes
      return true;
    }),

  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .custom(async (value) => {
      // Check if email already exists in the database
      const user = await UserModel.findOne({ email: value });
      if (user) {
        // If email already exists, throw an error
        throw new Error('Email is already taken');
      }
      // If email does not exist, validation passes
      return true;
    }),
    
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  
];
//Validation schema for login
export const loginValidationSchema = [

  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .custom(async (value) => {
      // Check if email already exists in the database
      const user = instanceOfUserDAO.userExists(value)
      if (!user) {
        // If email already exists, throw an error
        throw new Error('Invalid Email');
      }
      // If email does not exist, validation passes
      return true;
    }),
    
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  
];





