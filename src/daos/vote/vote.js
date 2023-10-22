// Data Access Object (DAO) for handling user-related database operations.
import VoteModel from '../../models/list/vote.js';

class VoteDAO {
    async findVoteByUserAndList(userId, listId) {
        // Use Mongoose or your DB driver to find the vote
        return await VoteModel.findOne({ 
            userId: userId,
            listId: listId});
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
        const newVoteType = (voteType === 'upvote') ? 'downvote' : 'upvote';
        await VoteModel.findOneAndUpdate(
            { userId: userId, listId: listId }, 
            { voteType: newVoteType, updatedAt: Date.now() }
        );
    
        
    }
    

}

const instanceOfVoteDAO = new VoteDAO();

export default instanceOfVoteDAO;
