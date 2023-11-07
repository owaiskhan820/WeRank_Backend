import express from 'express'
import { authMiddleware } from '../../authentication/authentication.js';
import watchlistService from '../../services/watchlist/watchlist.js';

const watchlistRouter= express.Router();

watchlistRouter.get('/getWatchlist/:id', async (req, res, next) => {


});

watchlistRouter.post('/addList', authMiddleware, async (req, res, next) => {

    try {
        const userId = req.user.id;
        const listId  = req.body.listId;
        const updatedWatchlist = await watchlistService.addWatchlistItem(userId, listId);
        res.status(201).json(updatedWatchlist);
      } catch (error) {
        next(error);
      }


});
// Get the user's watchlist
watchlistRouter.delete('/removeList', authMiddleware, async (req, res, next) => {

    try {
        const userId = req.user.id;
        const listId  = req.body.listId;
        const result = await watchlistService.removeWatchlistItem(userId, listId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }

});

watchlistRouter.get('/getWatchlistById', async (req, res, next) => {
    try {
        const userId = req.query.id; 
        const watchlistItems = await watchlistService.getWatchlistByUserId(userId);
        res.json(watchlistItems);
    } catch (error) {
        next(error);
    }
});

export default watchlistRouter;