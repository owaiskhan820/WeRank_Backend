import ListModel from "../../models/list/list.js";

class userFeedDAO{

    async getPostsByInterests(interests) {
        // Fetch posts matching the interests
        const posts = await ListModel.find({ categoryId : { $in: interests } });
         console.log(posts)
        return posts;
    }

    async getContentByUserIds(userIds) {

        // Query MongoDB to get content where the creator's ID is in the list of userIds
        const content = await ListModel.find({
            userId: { $in: userIds }
        });

        return content;
    }
    
}

const instanceOfUserFeedDAO = new userFeedDAO();

export default instanceOfUserFeedDAO;