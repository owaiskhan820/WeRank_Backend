import mongoose from 'mongoose';
import WatchlistSchema from '../../schemas/watchlist/watchlist.js';

const WatchlistModel = mongoose.model('Watchlist', WatchlistSchema);

export default WatchlistModel;
