import express from 'express'
import { authMiddleware } from '../../utils/authentication/authentication.js'
import watchlistService from '../../services/watchlist/watchlist.js';
import listService from '../../services/list/list.js'
const watchlistRouter= express.Router();

watchlistRouter.post('/isListInWatchlist/:listId/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const listId = req.params.listId;

      const isListInWatchlist = await watchlistService.checkListInWatchlist(userId, listId);
      res.status(200).json({ isListInWatchlist });
  } catch (error) {
      console.error('Error in isListInWatchlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
watchlistRouter.post('/addList', authMiddleware, async (req, res, next) => {
  try {
      const userId = req.user.id;
      const listId  = req.body.listId;
      const result = await watchlistService.addWatchlistItem(userId, listId);
      
      if (result.status === 'exists') {
          return res.status(409).json({ message: result.message });
      }

      res.status(201).json(result.item);
  } catch (error) {
      console.error('Error in addWatchlistItem:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Get the user's watchlist
watchlistRouter.delete('/removeList', authMiddleware, async (req, res, next) => {
  try {
      const userId = req.user.id;
      const listId = req.body.listId;
      const result = await watchlistService.removeWatchlistItem(userId, listId);
      res.status(200).json(result); // Status 200 for successful deletion
  } catch (error) {
      next(error); // Forward the error to the error handling middleware
  }
});

watchlistRouter.get('/getWatchlistById', async (req, res, next) => {
    try {
        const userId = req.query.id; 
        const watchlistItems = await watchlistService.getWatchlistByUserId(userId);

        // Extract listIds from watchlistItems
        const listIds = watchlistItems.map(item => item.listId);

        // Fetch lists corresponding to the listIds
        const lists = await listService.getListsByIds(listIds);

        res.json(lists);
    } catch (error) {
        next(error);
    }
});

export default watchlistRouter;