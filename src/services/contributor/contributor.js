import instanceOfContributorDAO from "../../daos/contributor/contributor.js";
import notificationService from "../notifications/notifications.js";
class ContributorService{

    async addContributor(listId, userId){
        try {
            // Attempt to add the contributor
            const response = await instanceOfContributorDAO.addContributor(listId, userId);
    
            // If contributor addition is successful, send notification
            const actionType = 'contribute';
            const actionUser = userId;
            const actionId = listId;
    
            // Call the notify method
            await notificationService.notify(actionUser, actionType, actionId);
                return response;
        } catch(error){
            // Handle any errors that occur during the process
            throw error;
        }
    }

    async getUserContributions(userId){
        try {
            const contributions = await instanceOfContributorDAO.getContributionsByUserId(userId);
            return contributions;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getContributorsForList(listId){
            return await instanceOfContributorDAO.getContributorsByListId(listId);       
    }

    async verifyContributor(listId, userId){
        try {
            await instanceOfContributorDAO.verifyContributor(listId, userId);
        } catch (error) {
            throw error; // propagate the error to the calling function or controller
        }
    };



    
}

const contributorService = new ContributorService();
export default contributorService;