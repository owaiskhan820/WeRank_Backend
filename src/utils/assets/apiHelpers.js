// This function checks for validation errors using express-validator middleware.

import { validationResult } from "express-validator";

// If errors are found, it sends a response with the error messages.
export const validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log("🚀 ~ file: apiHelpers.js:5 ~ validateErrors ~ errors:", errors, errors.isEmpty())

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ "response": { errorMessage: errorMessages.join(', ') } });
    }
    console.log("running")
    next();
}

// This function wraps the result in a response object.
export const apiOk = (result) => {
    return  {"response": result };
}

// Exporting the functions as an object for use in other files.
const apiHelpers = {
    validateErrors,
    apiOk
};

export default apiHelpers;
