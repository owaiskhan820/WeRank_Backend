import instanceOfFollowDAO from "../../daos/follow/follow.js";
class FollowService{
    async followUser(followerId, followingId){
        if (followerId === followingId) {
            throw new Error("User can't follow themselves");
        }
        return await instanceOfFollowDAO.createFollow(followerId, followingId);
    }
    
    async unfollowUser(followerId, followingId){
        return await instanceOfFollowDAO.deleteFollow(followerId, followingId);
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
        return instanceOfFollowDAO.getFollowingByUserId(userId);
    }

    async countFollowers(userId) {
        return instanceOfFollowDAO.countFollowersDAO(userId);
      }
      

    async countFollowing(userId) {
        return instanceOfFollowDAO.countFollowing(userId);
      }
}

const followService = new FollowService();
export default followService;