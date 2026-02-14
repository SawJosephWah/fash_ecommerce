import { body } from 'express-validator';

export const productCreateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .toFloat() // Converts string "29.99" to number
    .isNumeric()
    .withMessage('Price must be a number'),

  body('instock_count')
    .notEmpty()
    .withMessage('In-stock count is required')
    .toInt() // Converts string "10" to number
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive whole number'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('sizes')
    .notEmpty()
    .withMessage('Sizes are required')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),

  body('colors')
    .notEmpty()
    .withMessage('Colors are required')
    .isArray({ min: 1 })
    .withMessage('At least one color is required'),

  body('rating_count')
    .notEmpty()
    .withMessage('Rating count is required')
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Rating count must be 0 or more'),

  body('is_new_arrival')
    .notEmpty()
    .withMessage('New arrival status is required')
    .toBoolean()
    .isBoolean()
    .withMessage('Must be a boolean (true/false)'),

  body('is_featured')
    .notEmpty()
    .withMessage('Featured status is required')
    .toBoolean()
    .isBoolean()
    .withMessage('Must be a boolean (true/false)'),

  body('images').custom((value, { req }) => {
    if (!req.files || req.files.length === 0) {
      throw new Error('At least one product image is required');
    }
    return true;
  })
];


export const productUpdateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .toFloat() // Converts string "29.99" to number
    .isNumeric()
    .withMessage('Price must be a number'),

  body('instock_count')
    .notEmpty()
    .withMessage('In-stock count is required')
    .toInt() // Converts string "10" to number
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive whole number'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('sizes')
    .notEmpty()
    .withMessage('Sizes are required')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),

  body('colors')
    .customSanitizer(value => {
      // If it's a single string, wrap it in an array
      if (typeof value === 'string') return [value];
      return value;
    })
    .isArray({ min: 1 })
    .withMessage('At least one color is required'),

  body('rating_count')
    .notEmpty()
    .withMessage('Rating count is required')
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Rating count must be 0 or more'),

  body('is_new_arrival')
    .notEmpty()
    .withMessage('New arrival status is required')
    .toBoolean()
    .isBoolean()
    .withMessage('Must be a boolean (true/false)'),

  body('is_featured')
    .notEmpty()
    .withMessage('Featured status is required')
    .toBoolean()
    .isBoolean()
    .withMessage('Must be a boolean (true/false)'),

  body('existing_images').custom((value, { req }) => {
    // 1. Parse existing_images if it's a string (it usually is from FormData)
    let existing = [];
    try {
      if (typeof value === 'string') {
        existing = JSON.parse(value);
      } else if (Array.isArray(value)) {
        existing = value;
      }
    } catch (e) {
      existing = [];
    }

    // 2. Check for new files from Multer
    const newFiles = req.files || [];

    // 3. Validation Logic: Fail ONLY if both are empty
    if (existing.length === 0 && newFiles.length === 0) {
      throw new Error('Product must have at least one image (either existing or new)');
    }

    return true;
  }),
];