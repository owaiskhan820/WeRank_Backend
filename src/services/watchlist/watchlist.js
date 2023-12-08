import instanceOfWatchlistDAO from "../../daos/watchlist/watchlist.js";
import notificationService from "../notifications/notifications.js";

class WatchlistService{
    
    async getWatchlistByUserId(userId) {
    return instanceOfWatchlistDAO.getWatchlistByUserId(userId);
  }
  
  async addWatchlistItem(userId, listId) {
    const addedItem = await instanceOfWatchlistDAO.addWatchlistItem(userId, listId);

    // Notify about the new watchlist addition
    const actionType = 'watchlist';
    await notificationService.notify(userId, actionType, listId);

    return { status: 'added', item: addedItem };
}
  
   async  removeWatchlistItem(userId, itemId) {
    // Business logic if any
    return instanceOfWatchlistDAO.removeWatchlistItem(userId, itemId);
  }

  async checkListInWatchlist(userId, listId) {
    return await instanceOfWatchlistDAO.checkListInWatchlist(userId, listId);
}
  
  
    
}


const watchlistService = new WatchlistService();

export default watchlistService;