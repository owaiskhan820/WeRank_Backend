import instanceOfCommentDAO from "../../daos/comment/comment.js";

class CommentService {
    async addcomment(listId, userId, comment){
        return await instanceOfCommentDAO.addComment(listId, userId, comment)
    }    
}

const commentService = new CommentService();

export default commentService;


