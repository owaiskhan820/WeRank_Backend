import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Add your email validation here
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

export default userSchema;
