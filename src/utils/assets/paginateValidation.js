import { check, validationResult } from 'express-validator';

// Custom pagination validation middleware
const validatePagination = [
  check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  check('perPage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('PerPage must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
];

export default validatePagination;
