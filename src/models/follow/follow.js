import mongoose from 'mongoose';
import followSchema from '../../schemas/follow/follow.js';

const FollowModel = mongoose.model('Comment', followSchema);

export default FollowModel;
