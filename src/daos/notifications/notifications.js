import NotificationModel from "../../models/notifications/notifications.js";
class NotificationDAO{

    async saveNotification(userId, actionUserId, notificationType, listId, message) {
        const notification = new NotificationModel({
            userId,
            actionUserId,
            notificationType,
            listId,
            message
        });
    
        try {
            await notification.save();
            console.log('Notification saved successfully');
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    }

    async getNotificationsByUserId(userId) {
        try {
          return await NotificationModel.find({ userId: userId }).exec();
        } catch (error) {
          throw new Error(`Unable to retrieve notifications: ${error}`);
        }
      }


    async getUnreadNotifications(userId) {
        return await NotificationModel.find({ userId, readStatus: false });
    }


    async markNotificationAsRead(notificationId) {
      try {
        await NotificationModel.findByIdAndUpdate(notificationId, { readStatus: true });
        console.log('Notification marked as read successfully');
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error; // It's better to throw the error so that the service layer can handle it
      }
    }
    
    
    
}

const instanceOfNotificationDAO = new NotificationDAO();
export default instanceOfNotificationDAO;