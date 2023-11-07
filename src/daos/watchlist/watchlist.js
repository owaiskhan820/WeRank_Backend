import WatchlistModel from "../../models/watchlist/watchlist.js";

class WatchlistDAO{

async getWatchlistByUserId(userId) {
    try {
        return await WatchlistModel.find({ userId: userId })
          .populate({
            path: 'listId',
            populate: { path: 'items' }
          })
          .exec();
      } catch (error) {
        throw error;
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
    // Remove the item from the watchlist collection
    try {
      const result = await WatchlistModel.deleteOne({ userId, listId });
      // The result will indicate if a document was found and deleted
      if(result.deletedCount === 0){
        throw new Error('No item found with the specified userId and listId.');
      }
      return result;
    } catch (error) {
      // If there's an error, throw it to be handled by the calling function
      throw error;
    }
  }
  



}

const instanceOfWatchlistDAO = new WatchlistDAO()
export default instanceOfWatchlistDAO;