import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
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
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Reference to the Category or Interest model.
    }],
 
});

export default ProfileSchema;