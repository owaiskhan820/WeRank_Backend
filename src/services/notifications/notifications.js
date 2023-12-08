import instanceOfNotificationDAO from "../../daos/notifications/notifications.js";
import instanceOfUserDAO from "../../daos/user/user.js"
import instanceOfListDAO from "../../daos/list/list.js"
import instanceOfFollowDAO from "../../daos/follow/follow.js";
class NotificationService{

    
  async constructMessage(actionUser, action, actionId) {
    let message = {
      title: '',
      body: ''
    };
  
    const user = await instanceOfUserDAO.getUserById(actionUser); // Method to fetch actionUser's name
    const userName = user.username

    if (['upvote', 'downvote', 'comment', 'watchlist', 'contribute'].includes(action)) {
      const postTitle = await instanceOfListDAO.getListTitleByListId(actionId); // Method to fetch post/list title
  
      // Adjust the message format based on the action
      message.title = `${userName} ${action}d your list`;
      message.body = `${userName} ${action}d your list: "${postTitle}"`;
    } else if(action === 'contribute'){

      const postTitle = await instanceOfListDAO.getListTitleByListId(actionId); // Method to fetch post/list title
  
      // Adjust the message format based on the action
      message.title = `${userName} ${action}d your list`;
      message.body = `${userName} ${action}d to your list: "${postTitle}"`;

    }
    else if (action === 'newPost') {
      message.title = `${userName} created a new list`;
      message.body = `${userName} just created a new list, click to check it out.`;
    } else if (action === 'follow') {
      // Constructing a message for a follow action
      message.title = `${userName} started following you`;
      message.body = `${userName} is now following you. Check out their profile!`;
    }
  
    return message;
  }
  
      
  async notify(actionUser, actionType, actionId) {

    try {
      const recipientUserIds = await this.getNotificationRecipients(actionUser, actionType, actionId);
      const messageContent = await this.constructMessage(actionUser, actionType, actionId);

  
      for (const userId of recipientUserIds) {
        const response = await instanceOfNotificationDAO.saveNotification( userId, actionUser, actionType, actionId,  messageContent);
          console.log(response, "Notification Sent")
        }
      } catch (error) {
      console.error('Error in notify method:', error);
    }
  }
  
      
      async getNotificationRecipients(id, action, actionId) {
        let recipientUserIds = [];
    
        if (['upvote', 'downvote', 'comment', 'contribute', 'watchlist'].includes(action)) {
          // Actions where 'id' is a postId; fetch the post creator
          const postCreatorObject = await instanceOfListDAO.getListByListId(actionId);
          const postCreatorId = postCreatorObject.userId;
          recipientUserIds = postCreatorId;
        

          recipientUserIds = [postCreatorId];
        } else if (action === 'newPost') {
          // Action where 'id' is a userId; fetch all followers
          const recipientUserObjects = await instanceOfFollowDAO.getFollowersByUserId(id);
          recipientUserIds = recipientUserObjects.map(userObject => userObject.userId);
        }

        else if (action === 'follow') {
          recipientUserIds = [actionId];
        }
        return recipientUserIds;
      }

    
      async getUserNotifications(userId) {
          return await instanceOfNotificationDAO.getNotificationsByUserId(userId);
        }
      

        async getUnreadNotifications(userId) {
          return await instanceOfNotificationDAO.getUnreadNotifications(userId);
      }
    


      async markNotificationAsRead(notificationId) {
        try {
          await instanceOfNotificationDAO.markNotificationAsRead(notificationId);
        } catch (error) {
          console.error('Service error in markNotificationAsRead:', error);
          throw error; // Propagate the error up to the controller
        }
      }
      
   

}

const notificationService = new NotificationService();
export default notificationService;