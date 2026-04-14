import instanceOfVoteDAO from "../../daos/vote/vote.js";
import instanceOfListDAO from "../../daos/list/list.js";
import notificationService from "../notifications/notifications.js";
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
        const response = await instanceOfVoteDAO.addVote(userId, listId, voteType);
        await notificationService.notify(userId, voteType, listId);
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
           const response =  await instanceOfVoteDAO.switchVote(listId, userId, voteType)
            return response         
        } catch(error){
            throw error;
        }
    }

    async removeVote(listId, userId){
      return await instanceOfVoteDAO.removeVote(listId, userId)
    }

}

const voteService = new VoteService();

export default voteService;
