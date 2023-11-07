import FollowModel from "../../models/follow/follow.js";

class FollowDAO{
    async createFollow(followerId, followingId){
        return await FollowModel.create({ 
            follower: followerId, 
            following: followingId });
    }
    
    async deleteFollow(followerId, followingId){
        return await FollowModel.deleteOne({ follower: followerId, following: followingId });
    }
    
    async getFollowersByUserId(userId) {
        const followers = await FollowModel.find({ following: userId }).populate('follower', 'username');
        return followers;
    }

    
    async getFollowingByUserId(userId) {
        const following = await FollowModel.find({ follower: userId }).populate('following', 'username');
        return following;
    }

    async countFollowers(userId) {
        return FollowModel.countDocuments({ followedId: userId });
      }

    async countFollowing(userId) {
        return FollowModel.countDocuments({ followingId: userId });
      }
}

const instanceOfFollowDAO = new FollowDAO();
export default instanceOfFollowDAO;