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
    score: {
        type: Number,
        default: 0,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    upVotes: {
        type: Number,
        default: 0,
    },

    downVotes: {
        type: Number,
        default: 0,
    },

    comments: {
        type: Number,
        default: 0,
    },

    updatedDate: {
        type: Date,
    },

    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
});

export default listSchema;
