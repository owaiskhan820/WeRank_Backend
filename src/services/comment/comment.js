import instanceOfCommentDAO from "../../daos/comment/comment.js";
import notificationService from "../notifications/notifications.js";

class CommentService {
  async addcomment(listId, userId, commentText){
    // Save the comment
    const newComment = await instanceOfCommentDAO.addComment(listId, userId, commentText);

    // Prepare parameters for notification
    const actionType = 'comment';
    const actionUser = userId;
    const actionId = listId;

    // Call the notify method
    await notificationService.notify(actionUser, actionType, actionId);

    // Return the saved comment
    return newComment;
}   

    async getComments(listId){
        return await instanceOfCommentDAO.getCommentsByListId(listId);
    }


    async deleteComment(commentId) {
        try {
          const deletedComment = await instanceOfCommentDAO.deleteComment(commentId);
          return deletedComment;
        } catch (error) {
          throw new Error('Service error: Unable to delete comment');
        }
      }
}

const commentService = new CommentService();

export default commentService;


