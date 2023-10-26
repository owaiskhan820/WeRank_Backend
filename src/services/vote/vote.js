import instanceOfVoteDAO from "../../daos/vote/vote.js";
import instanceOfListDAO from "../../daos/list/list.js";

class VoteService{

    async findVoteByUserAndList(userId, listId) {
        // Use Mongoose or your DB driver to find the vote
        return await instanceOfVoteDAO.findVoteByUserAndList( userId, listId );
    }

    async updateVote(voteId, newVoteType) {
        // Update the vote type for the given voteId
        return await instanceOfVoteDAO.updateVote(voteId,  newVoteType );
    }

    async addVote(userId, listId, voteType) {
        // Add a new vote entry
        await instanceOfVoteDAO.addVote( userId, listId, voteType );
        const response = instanceOfListDAO.incrementVoteCount(listId, voteType)
        return response;
    }

    async deleteVote(voteId){
        try{
            const result = await instanceOfVoteDAO.deleteVote(voteId);
            return result
        } catch(error)
        {
            throw error
        }
    }

    async switchVote(listId, userId, voteType) {
        try{
            await instanceOfVoteDAO.switchVote(listId, userId, voteType)
            // 2. Update the vote counts in ListModel
            const response = instanceOfListDAO.incrementVoteCount(listId, voteType)
            return response;
        } catch(error){
            throw error;
        }
    }

}

const voteService = new VoteService();

export default voteService;
