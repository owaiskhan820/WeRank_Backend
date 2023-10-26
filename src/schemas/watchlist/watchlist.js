import mongoose from 'mongoose';
const { Schema } = mongoose;
const WatchlistSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default WatchlistSchema
