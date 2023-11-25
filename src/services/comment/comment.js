import instanceOfCommentDAO from "../../daos/comment/comment.js";

class CommentService {
    async addcomment(listId, userId, comment){
        return await instanceOfCommentDAO.addComment(listId, userId, comment)
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


