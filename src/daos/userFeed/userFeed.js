import ListModel from "../../models/list/list.js";

class userFeedDAO{

    async getPostsByInterests(interests) {
        // Fetch posts matching the interests and populate the categoryName
        return await ListModel.find({ categoryId: { $in: interests } })
                                     .populate('categoryId', 'categoryName');
        
    }

    async getContentByUserIds(userIds) {
        // Fetch posts matching the interests and populate the categoryName
        return await ListModel.find({ userId: { $in: userIds } })
                                     .populate('categoryId', 'categoryName');
        
    }
    
}

const instanceOfUserFeedDAO = new userFeedDAO();

export default instanceOfUserFeedDAO;