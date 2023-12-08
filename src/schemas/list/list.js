import mongoose from 'mongoose';
const { Schema } = mongoose;

const listItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    }
});



const listSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3, // example validation
        maxlength: 100, // example validation
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming the user model is named 'User'
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category', // Assuming the category model is named 'Category'
        required: true,
    },
    listItems: {
        type: [listItemSchema],
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
    },

    description: {
        type: String,
        trim: true, // Trims whitespace from the beginning and end
        maxlength: 500, // Maximum length of the description
        // You can add 'required' or 'default' if needed
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
});

export default listSchema;
