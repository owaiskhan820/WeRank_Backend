import instanceOfFollowDAO from "../../daos/follow/follow";
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
    
    async getFollowersOfUser(userId){
        return await instanceOfFollowDAO.listFollowersOfUser(userId);
    }
    
    async getUsersFollowedBy(userId){
        return await instanceOfFollowDAO.listUsersFollowedBy(userId);
    }
    
}

const followService = new FollowService();
export default followService;