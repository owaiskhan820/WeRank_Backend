import express from 'express';
import notificationService from '../../services/notifications/notifications.js';
import { authMiddleware } from '../../utils/authentication/authentication.js';
const notificationsRouter = express.Router();



// Create a List
notificationsRouter.get('/getNotifications', authMiddleware, async (req, res) => {

    try {
        const userId = req.user.id;
        const notifications = await notificationService.getUserNotifications(userId);
        res.json(notifications);
      } catch (error) {
        res.status(500).send('Error getting notifications');
      }
   
});

notificationsRouter.get('/Notifications/unread', authMiddleware, async (req, res) => {

  try {
    const userId = req.user.id;
    const unreadNotifications = await notificationService.getUnreadNotifications(userId);
    res.json(unreadNotifications);
} catch (error) {
    res.status(500).send(error.message);
}
 
});


notificationsRouter.get('/notifications/:id/read', authMiddleware, async (req, res) => {

  try {
    const { id } = req.params;
    await notificationService.markNotificationAsRead(id);
    res.status(200).send({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).send(error.message);
  }
 
});






export default notificationsRouter