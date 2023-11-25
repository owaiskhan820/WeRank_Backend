import instanceOfWatchlistDAO from "../../daos/watchlist/watchlist.js";


class WatchlistService{
    
    async getWatchlistByUserId(userId) {
    return instanceOfWatchlistDAO.getWatchlistByUserId(userId);
  }
  
  async addWatchlistItem(userId, listId) {
    const exists = await instanceOfWatchlistDAO.itemExists(userId, listId);
    if (exists) {
        return { status: 'exists', message: "Item already in your Watchlist." };
    }
    const addedItem = await instanceOfWatchlistDAO.addWatchlistItem(userId, listId);
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