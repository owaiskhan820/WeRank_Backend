
import Joi from 'joi';

// Define validation for an individual list item
const listItemValidationSchema = Joi.object({
    name: Joi.string().required()
    // Note: `score` is not included here since it has a default value in the mongoose schema and the user is not supposed to provide it
});

// Define validation for the entire list
export const listValidationSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Validate the categoryId
    listItems: Joi.array().items(listItemValidationSchema).required(),
    // Note: `score` and `createdDate` are not included here since they have default values in the mongoose schema and the user is not supposed to provide them
    upVotes: Joi.number().integer().min(0).optional(),
    downVotes: Joi.number().integer().min(0).optional(),
    comments: Joi.number().integer().min(0).optional(),
    // Note: `updatedDate` is not included since it's likely to be set programmatically when updating a list
    visibility: Joi.string().valid('public', 'private').optional() // It's optional since it has a default value in the mongoose schema
});

export function validateList(req, res, next) {
    const { error } = listValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
