import FollowModel from "../../models/follow/follow.js";

class FollowDAO{
    async createFollow(followerId, followingId){
        const follow = await FollowModel.create({ 
            follower: followerId, 
            following: followingId
        });
    
        // Increment follower count
        await UserModel.findByIdAndUpdate(followingId, { $inc: { followerCount: 1 } });
    
        return follow;
    }
    
    async deleteFollow(followerId, followingId){
        const result = await FollowModel.deleteOne({ follower: followerId, following: followingId });
    
        // Decrement follower count if a document was deleted
        if (result.deletedCount > 0) {
            await UserModel.findByIdAndUpdate(followingId, { $inc: { followerCount: -1 } });
        }
    
        return result;
    }
    
    async getFollowersByUserId(userId) {
        const followers = await FollowModel.find({ following: userId }).populate('follower', 'username');
        return followers;
    }

    
    async getFollowingByUserId(userId) {
      try {
          const following = await FollowModel
            .find({ follower: userId })
            .populate('following', 'username')
            .exec();

            console.log(following)
  
          return following.map(f => ({
            userId: f.following._id, 
            username: f.following.username
          }));
      } catch (error) {
          console.error("Error in getFollowingByUserId: ", error);
          throw error; // Re-throw the error for further handling
      }
  }
  
   

    async countFollowers(userId) {
        return FollowModel.countDocuments({ following: userId });
      }

    async countFollowing(userId) {
        return FollowModel.countDocuments({ follower: userId });
      }
}

const instanceOfFollowDAO = new FollowDAO();
export default instanceOfFollowDAO;