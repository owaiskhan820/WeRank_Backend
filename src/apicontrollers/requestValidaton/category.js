import { body } from 'express-validator';
import CategoryModel from '../../models/category/category.js';

export const categoryValidationSchema = [

  body('categoryName')
    .exists().withMessage('Category name is required')
    .isString().withMessage('Category name must be a string')
    .trim() // Removes whitespace
    .notEmpty().withMessage('Category name cannot be empty')
    .custom(async (value) => {
      // Check if category already exists in the database
      const category = await CategoryModel.findOne({ categoryName: value });
      if (category) {
        // If category name already exists, throw an error
        throw new Error('Category name is already taken');
      }
      // If category name does not exist, validation passes
      return true;
    }),

];