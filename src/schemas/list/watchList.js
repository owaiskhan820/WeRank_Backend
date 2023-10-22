import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',   
        required: true,
        index: true  // To quickly query by user_id
    },
    list_id: {
        type: Schema.Types.ObjectId,
        ref: 'List',   
        required: true,
        index: true  // To quickly query by list_id
    }
}, { timestamps: true });  

watchlistSchema.index({ user_id: 1, list_id: 1 }, { unique: true });  // Creates a unique composite index on both user_id and list_id to prevent duplicate entries in the Watchlist collection.


export default watchlistSchema;
