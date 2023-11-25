
import ContributorModel from "../../models/list/contributor.js";


class ContributorDAO{

    async addContributor(listId, userId) {
        const contributor = new ContributorModel({
            listId: listId,
            userId: userId
        });
        const response = await contributor.save();
        if(!response){
            throw new Error("could not add contributor")
        }
        return response;
      }
    
    async getContributionsByUserId(userId) {
        try {
            const contributions = await ContributorModel.find({ userId: userId })
                .exec();    
            return contributions;
        } catch (error) {
            throw new Error(`Failed to fetch list titles for user ID: ${userId}. Error: ${error.message}`);
        }
    }
        


    async getContributorsByListId(listId) {
        try {
            return await ContributorModel
                .find({ listId: listId }, 'userId') // Only return the 'userId' field
                .populate('userId', 'username')    // From the populated user, only return the 'username'
                .exec();
        } catch (error) {
            throw new Error(`Failed to fetch contributors for list ID: ${listId}. Error: ${error.message}`);
        }
    }
    
    async verifyContributor(listId, userId){
        const contributor = await ContributorModel.findOne({ listId, userId });
        if (contributor) {
            throw new Error('You have already contributed to this list');
        }
    };

}


const instanceOfContributorDAO = new ContributorDAO();
export default instanceOfContributorDAO;