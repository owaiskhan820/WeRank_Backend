import instanceOfContributorDAO from "../../daos/contributor/contributor.js";

class ContributorService{

    async addContributor(listId, userId){
        try {
            return await instanceOfContributorDAO.addContributor(listId, userId)

        } catch(error){
            throw error
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