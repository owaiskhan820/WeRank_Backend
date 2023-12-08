import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

    message: {
      title: { type: String, required: true },
      body: { type: String, required: true }
    },
  
  actionUserId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true },  

  notificationType: { 
    type: String, 
    required: true }, 

  listId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: false }, 
      
    createdAt: { 
    type: Date, 
    default: Date.now },

  readStatus: { 
    type: Boolean, 
    default: false },
 });

 export default notificationSchema;
