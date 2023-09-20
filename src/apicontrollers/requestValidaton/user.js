// Validation schema for user registration. It defines rules for validating email and password fields. ( use same )
import { body } from 'express-validator';

const userValidationSchema = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

export default userValidationSchema;
