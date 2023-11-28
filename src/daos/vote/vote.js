// Data Access Object (DAO) for handling user-related database operations.
import VoteModel from '../../models/list/vote.js';

class VoteDAO {
    async findVoteByUserAndList(userId, listId) {
        const vote = await VoteModel.findOne({ userId, listId });
        return vote ? { exists: true, voteType: vote.voteType } : { exists: false };
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
    
    

}

const instanceOfVoteDAO = new VoteDAO();

export default instanceOfVoteDAO;
