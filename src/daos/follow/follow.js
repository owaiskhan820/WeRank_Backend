import FollowModel from "../../models/follow/follow";

class FollowDAO{
    async createFollow(followerId, followingId){
        return await FollowModel.create({ follower: followerId, following: followingId });
    }
    
    async deleteFollow(followerId, followingId){
        return await FollowModel.deleteOne({ follower: followerId, following: followingId });
    }
    
    async listFollowersOfUser(userId){
        return await FollowModel.find({ following: userId }).populate('follower');
    }
    
    async listUsersFollowedBy(userId){
        return await FollowModel.find({ follower: userId }).populate('following');
    }
    
}

const instanceOfFollowDAO = new FollowDAO();
export default instanceOfFollowDAO;