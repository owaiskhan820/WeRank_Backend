import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
    trim: true,
    minlength: 3,
    match: [/^\w+$/, 'Username can only contain letters, numbers, and underscores']
  },
  isVerified: {
    type: Boolean,
    default: false // New field to track if the email is verified
  },
  emailVerificationToken: {
    type: String, // New field to store the email verification token
    default: 'N/A'
   },
  passwordResetToken: {
    type: String,
    default: 'N/A',
    required: false
  },
  
  
});

export default userSchema;
