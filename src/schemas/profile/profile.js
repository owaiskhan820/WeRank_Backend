import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ensure that one user only has one profile.
    },
    profilePicture: {
        type: String, // This can be a URL if you're using cloud storage or a path if stored locally.
        default: '/path/to/default/pic.png' // Placeholder for the default picture.
    },
    bio: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
        // Add more if needed.
    },
    postCount: {
        type: Number,
        default: 0
    },
    activity: [{
        type: String,
        enum: ['liked', 'commented', 'posted', 'shared'], // Add more activities as required.
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Reference to the Category or Interest model.
    }],
    actions: [{
        // Define user actions here, such as saved posts, liked comments, etc.
    }],
    watchlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watchlist'
    }]
});

export default ProfileSchema;