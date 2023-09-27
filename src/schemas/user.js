import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
   
  lasttName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

export default userSchema;
