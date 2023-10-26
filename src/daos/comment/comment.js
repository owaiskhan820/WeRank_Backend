// Data Access Object (DAO) for handling list-related database operations.
import CommentModel from '../../models/list/comment.js';


class CommentDAO {
    
    async addComment(listId, userId, text){
        const newComment = new CommentModel({
            listId: listId,
            userId: userId,
            text: text
        });

        // Save the new comment document
        await newComment.save();

        // Return the newly added comment
        return newComment;
    }

  }    


const instanceOfCommentDAO = new CommentDAO();

export default instanceOfCommentDAO;
