import mongoose from 'mongoose';
import followSchema from '../../schemas/follow/follow.js';

const FollowModel = mongoose.model('follow', followSchema);

export default FollowModel;
