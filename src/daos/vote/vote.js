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

    async deleteVote(voteId){
        try{
            const result = await VoteModel.findByIdAndDelete(voteId);
            return result}catch(error)
        {
            throw error
        }
    }

    async switchVote(listId, userId, voteType) {

        // Validate the vote type
        if (voteType !== 'upvote' && voteType !== 'downvote') {
            throw new Error('Invalid vote type');
        }
    
        // 1. Update the vote in VoteModel collection

        await VoteModel.findOneAndUpdate(
            { userId: userId, listId: listId }, 
            { voteType: voteType, updatedAt: Date.now() }
        );
    
        
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
            const result = await instanceOfVoteDAO.removeVote(listId, userId);
            return result;
        } catch (error) {
            // Handle or rethrow the error depending on your error handling strategy
            console.error('Error in voteService.removeVote:', error);
            throw error;
        }
    }
    
    async removeVote(listId, userId){
        try {
            // Remove the vote document where the userId and listId match
            const result = await VoteModel.deleteOne({ userId: userId, listId: listId });
            if (result.deletedCount === 0) {
                throw new Error('No vote found to delete.');
            }
            return result;
        } catch (error) {
            // Handle or throw the error depending on your error handling strategy
            console.error('Error in removeVote:', error);
            throw error;
        }
    }
    

}

const instanceOfVoteDAO = new VoteDAO();

export default instanceOfVoteDAO;
