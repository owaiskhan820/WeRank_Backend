
import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    listId: { 
      type: Schema.Types.ObjectId, 
      ref: 'List', 
      required: true 
    },
    voteType: { 
      type: String, 
      enum: ['upvote', 'downvote'], 
      required: true 
    },
    createdAt: { type: Date, default: Date.now }
  });
  
  export default voteSchema;
  