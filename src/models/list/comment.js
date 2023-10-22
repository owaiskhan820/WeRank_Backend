import mongoose from 'mongoose';
import commentSchema from '../../schemas/list/comment.js';

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;
