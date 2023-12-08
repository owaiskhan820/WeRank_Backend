import mongoose from 'mongoose';
import notificationSchema from '../../schemas/notifications/notifications.js';
 
const NotificationModel = mongoose.model('Notifications', notificationSchema);

export default NotificationModel;
