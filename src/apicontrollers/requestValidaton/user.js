// Validation schema for user registration. It defines rules for validating email and password fields. ( use same )
import { body } from 'express-validator';

const userValidationSchema = [
 
  body('firstName')
    .exists().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only alphabetic characters')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .trim(),

  body('lastName')
    .exists().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only alphabetic characters')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .trim(),

  body('username')
    .exists().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must contain only alphanumeric characters')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .trim()
    .toLowerCase(),

  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
    
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  
];

export default userValidationSchema;
