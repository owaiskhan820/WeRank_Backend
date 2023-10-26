import mongoose from 'mongoose';
import profileSchema from '../../schemas/profile/profile.js';

const ProfileModel = mongoose.model('Profile', profileSchema);

export default ProfileModel;
