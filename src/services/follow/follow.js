import instanceOfFollowDAO from "../../daos/follow/follow.js";
import instanceOfUserDAO from "../../daos/user/user.js";
import userService from "../user/user.js";
import notificationService from "../../services/notifications/notifications.js"



class FollowService{
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new Error("User can't follow themselves");
        }

        // Create the follow relationship in the database
        const followResult = await instanceOfFollowDAO.createFollow(followerId, followingId);
     
        await notificationService.notify(followerId, 'follow', followingId);

        return followResult;
    }
    
    async unfollowUser(followerId, followingId){
        const result = await instanceOfFollowDAO.deleteFollow(followerId, followingId);
        return result;
    }
    
    async getFollowersByUserId(userId){
            if (!userId) {
                throw new Error('User ID is required');
            }
            return instanceOfFollowDAO.getFollowersByUserId(userId);
        
    }
    
    async getFollowingByUserId(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const following = instanceOfFollowDAO.getFollowingByUserId(userId);
        return following;
    }
    

    async countFollowers(userId) {
        return instanceOfFollowDAO.countFollowers(userId);
      }
      

    async countFollowing(userId) {
        return instanceOfFollowDAO.countFollowing(userId);
      }



    async isFollowing(followerId, followingId) {

        return instanceOfFollowDAO.isFollowing(followerId, followingId)
      
    }
}

const followService = new FollowService();
export default followService;