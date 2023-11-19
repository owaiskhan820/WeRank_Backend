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
        // Error handling
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


// // Main Feed
// router.get('/feed/main', authMiddleware, (req, res, next) => {
//     // TODO: Fetch main feed logic
    
// });

// // Recommendation Feed
// router.get('/feed/recommendations', authMiddleware, (req, res, next) => {
//     // TODO: Fetch recommendation feed logic
// });

// // List Recommendations
// router.get('/feed/recommendations/lists', authMiddleware, (req, res, next) => {
//     // TODO: Fetch list recommendations logic
// });

// // User Recommendations
// router.get('/feed/recommendations/users', authMiddleware, (req, res, next) => {
//     // TODO: Fetch user recommendations logic
// });

// // Interest-Based Feed
// router.get('/feed/interests/:interestId', authMiddleware, (req, res, next) => {
//     // TODO: Fetch interest-based feed logic
// });

// // Followings' New Lists
// router.get('/feed/followings/new', authMiddleware, (req, res, next) => {
//     // TODO: Fetch followings' new lists logic
// });

// // Mutual Follows
// router.get('/feed/mutual-follows', authMiddleware, (req, res, next) => {
//     // TODO: Fetch mutual follows logic
// });

export default feedRouter;