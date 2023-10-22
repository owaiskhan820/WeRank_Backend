import mongoose from 'mongoose';
import voteSchema from '../../schemas/list/vote.js';

const VoteModel = mongoose.model('Vote', voteSchema);

export default VoteModel;
