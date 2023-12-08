import FollowModel from "../../models/follow/follow.js";

class FollowDAO{
    async createFollow(followerId, followingId){
        const follow = await FollowModel.create({ 
            follower: followerId, 
            following: followingId
        });

    
        return follow;
    }
    
    async deleteFollow(followerId, followingId){
        const result = await FollowModel.deleteOne({ follower: followerId, following: followingId });
        return result;
    }
    
    async getFollowersByUserId(userId) {
      try {
          const followers = await FollowModel
              .find({ following: userId })
              .populate('follower', 'username firstName lastName')
              .exec();  
          return followers.map(f => ({
              userId: f.follower._id, 
              username: f.follower.username,
              firstName: f.follower.firstName,
              lastName: f.follower.lastName
          }));
      } catch (error) {
          console.error("Error in getFollowersByUserId: ", error);
          throw error;
      }
  }
  
  async getFollowingByUserId(userId) {
      try {
          const following = await FollowModel
              .find({ follower: userId })
              .populate('following', 'username firstName lastName')
              .exec();  
          return following.map(f => ({
              userId: f.following._id, 
              username: f.following.username,
              firstName: f.following.firstName,
              lastName: f.following.lastName
          }));
      } catch (error) {
          console.error("Error in getFollowingByUserId: ", error);
          throw error;
      }
  }
  
  
   

    async countFollowers(userId) {
        return FollowModel.countDocuments({ following: userId });
      }

    async countFollowing(userId) {
        return FollowModel.countDocuments({ follower: userId });
      }


    async isFollowing(followerId, followingId) {
        const follow = await FollowModel.findOne({ 
            follower: followerId, 
            following: followingId 
        });
    
        return follow !== null;
    }
}

const instanceOfFollowDAO = new FollowDAO();
export default instanceOfFollowDAO;