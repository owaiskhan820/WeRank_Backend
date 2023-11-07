import instanceOfWatchlistDAO from "../../daos/watchlist/watchlist.js";


class WatchlistService{
    
    async getWatchlistByUserId(userId) {
    return instanceOfWatchlistDAO.getWatchlistByUserId(userId);
  }
  
   async  addWatchlistItem(userId, listId) {
    const exists = await instanceOfWatchlistDAO.itemExists(userId, listId)
    if(exists){
        return "Item already in your Watchlist."
    }
    return instanceOfWatchlistDAO.addWatchlistItem(userId, listId);
  }
  
   async  removeWatchlistItem(userId, itemId) {
    // Business logic if any
    return instanceOfWatchlistDAO.removeWatchlistItem(userId, itemId);
  }
  
  
    
}


const watchlistService = new WatchlistService();

export default watchlistService;