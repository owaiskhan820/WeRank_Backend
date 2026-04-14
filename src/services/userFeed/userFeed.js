// In yourFeedService.js

import instanceOfUserFeedDAO from "../../daos/userFeed/userFeed.js";
import instanceOfProfileDAO from "../../daos/profile/profile.js";
import instanceOfFollowDAO from "../../daos/follow/follow.js";

class UserFeedService{

    async getInterestBasedContent(userId) {
        // Logic to determine user's interests
        const profile = await instanceOfProfileDAO.getProfileByUserId(userId);
        const following = await instanceOfFollowDAO.getFollowingByUserId(userId);
    
        // Extract user IDs from the following list
        const followingUserIds = following.map(user => user.userId);
    
        // Check if the profile has interests
        if (!profile.interests) {
            throw new Error('No interests found for the user');
        } else {
            // Fetch content based on user's interests
            let interestContent = await instanceOfUserFeedDAO.getPostsByInterests(profile.interests);
    
            // Filter out content from followed users
            interestContent = interestContent.filter(content => !followingUserIds.includes(content.userId));
    
            return interestContent;
        }
    }
    


    async getFollowingBasedContent(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        const followRelationships = await instanceOfFollowDAO.getFollowingByUserId(userId);

        // Assuming followingUsers is an array of user IDs
        const followingIds = followRelationships.map(rel => rel.userId);
        const interestContent = await instanceOfUserFeedDAO.getContentByUserIds(followingIds);
        return interestContent;

    }



}
const userFeedService = new UserFeedService();

export default userFeedService;

