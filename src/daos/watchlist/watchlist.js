import WatchlistModel from "../../models/watchlist/watchlist.js";

class WatchlistDAO{

  async getWatchlistByUserId(userId) {
    try {
        const watchlistItems = await WatchlistModel.find({ userId: userId }).exec();
        return watchlistItems; // This will return watchlist items with just listIds
    } catch (error) {
        throw new Error(`Failed to fetch watchlist for user ID: ${userId}. Error: ${error.message}`);
    }
}
async addWatchlistItem(userId, listId) {
    const newWatchlistItem = new WatchlistModel({
        userId,
        listId
      });
      
      try {
        const savedItem = await newWatchlistItem.save();
        return savedItem;
      } catch (error) {
        throw error;
      }
}


async itemExists(userId, listId) {
    try {
      const item = await WatchlistModel.findOne({ userId, listId });
      return item
    } catch (error) {
      throw error;
    }
  }

  async removeWatchlistItem(userId, listId) {
      try {
          const result = await WatchlistModel.findOneAndDelete({ userId, listId });
          return result; 
      } catch (error) {
          throw error; 
      }
  }

  async getWatchlistedListsByUserIds(userIds) {
    try {
      return await WatchlistModel.find({ userId: { $in: userIds } })
        .populate({
          path: 'listId',
          populate: { path: 'listItems' }
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }
  
  async checkListInWatchlist(userId, listId) {
    const item = await WatchlistModel.findOne({ userId, listId });
    return item != null;
}



}

const instanceOfWatchlistDAO = new WatchlistDAO()
export default instanceOfWatchlistDAO;