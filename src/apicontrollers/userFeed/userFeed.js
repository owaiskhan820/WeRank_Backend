import express from 'express'
import userFeedService from '../../services/userFeed/userFeed.js';
const feedRouter = express.Router();
import {authMiddleware} from '../../utils/authentication/authentication.js'




feedRouter.get('/feed/your', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const content = await userFeedService.getInterestBasedContent(userId);
        
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching for you feed:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching for you feed' });
    }
});

feedRouter.get('/feed/following', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const content = await userFeedService.getFollowingBasedContent(userId);
        
        res.status(200).json(content);
    } catch (error) {
        // Error handling
        console.error('Error fetching for you feed:', error.message);
        res.status(500).json({ success: false, message: error });
    }
});

export default feedRouter;