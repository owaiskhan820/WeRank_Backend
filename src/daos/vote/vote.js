// Data Access Object (DAO) for handling user-related database operations.
import VoteModel from '../../models/list/vote.js';

class VoteDAO {
    async findVoteByUserAndList(userId, listId) {
        const vote = await VoteModel.findOne({ userId, listId });

        if (vote) {
            return {
                upvoted: vote.voteType === 'upvote',
                downvoted: vote.voteType === 'downvote'
            };
        }

        return { upvoted: false, downvoted: false };
    }    
    async updateVote(voteId, newVoteType) {
        // Update the vote type for the given voteId
        return await VoteModel.findByIdAndUpdate(voteId, { voteType: newVoteType });
    }

    async addVote(userId, listId, voteType) {
        // Add a new vote entry
        return await VoteModel.create({ userId, listId, voteType });
        
    }
    async switchVote(listId, userId, voteType) {

        // Validate the vote type
        if (voteType !== 'upvote' && voteType !== 'downvote') {
            throw new Error('Invalid vote type');
        }
    
        // 1. Update the vote in VoteModel collection

       const response =  await VoteModel.findOneAndUpdate(
            { userId: userId, listId: listId }, 
            { voteType: voteType, updatedAt: Date.now() }
        );

        return response;
    
        
    }

    async FindVoteByListId(listId) {
        const votes = await VoteModel.find({ listId });
        if (votes && votes.length > 0) {
            const voteDetails = votes.map(vote => {
                return { voteType: vote.voteType, createdAt: vote.createdAt };
            });
            return { voteDetails: voteDetails };
        } else {
            return { exists: false };
        }
    }

    async removeVote(listId, userId){
        try {
            // Call the DAO method to remove the vote
            await instanceOfVoteDAO.removeVote(listId, userId);
            return { upvoted: false, downvoted: false };

        } catch (error) {
            // Handle or rethrow the error depending on your error handling strategy
            console.error('Error in voteService.removeVote:', error);
            throw error;
        }
    }
    
  
    

}

const instanceOfVoteDAO = new VoteDAO();

export default instanceOfVoteDAO;
