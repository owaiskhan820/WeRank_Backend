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
    
        // Populate the userId field with username before returning
        const populatedComment = await CommentModel.findById(newComment._id).populate('userId', 'username');
        return populatedComment;
    }


    async getCommentsByListId(listId){
        try {
            const comments = await CommentModel.find({ listId }).populate('userId', 'username');
            return comments;
        } catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }

    async FindCommentDetailsByListId(listId) {
        const comment = await CommentModel.find({ listId });
        if (comment && comment.length > 0) {
            const commentDetails = comment.map(comment => {
                return { text: comment.text, createdAt: comment.date };
            });
            return { commentDetails: commentDetails };
        } else {
            return { exists: false };
        }
    }

    async deleteComment(commentId) {
        try {
          const result = await CommentModel.findByIdAndDelete(commentId);
          return result;
        } catch (error) {
          throw new Error('Error deleting comment');
        }
      }

  }    


const instanceOfCommentDAO = new CommentDAO();

export default instanceOfCommentDAO;
