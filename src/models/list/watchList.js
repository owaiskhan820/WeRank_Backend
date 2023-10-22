import mongoose from 'mongoose';
import watchlistSchema from '../../schemas/list/watchList.js';

const WatchListModel = mongoose.model('Vote', watchlistSchema);

export default VoteModel;
