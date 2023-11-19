import express  from "express";
import apiHelpers from '../../utils/assets/apiHelpers.js';
import followService from "../../services/follow/follow.js";
import { authMiddleware } from '../../utils/authentication/authentication.js'

const followRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;


followRouter.get('/followUser/:userId', authMiddleware, validateErrors, async (req, res, next) => {
    try {
        const userIdToFollow = req.params.userId;
        const followerId = req.user.id; // Assuming 'req.user' is populated from some authentication middleware

        // Check if the user is trying to follow themselves
        if (userIdToFollow === followerId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const followStatus = await followService.followUser(followerId, userIdToFollow);

        res.status(200).json({ message: "Successfully followed the user", followStatus });
    } catch (error) {
        next(error);
    }
});

followRouter.get('/unfollow/:userId', authMiddleware, validateErrors, async (req, res, next) => {

    try {
        const followerId = req.user.id; 
        const userIdToUnfollow = req.params.userId;

        await followService.unfollowUser(followerId, userIdToUnfollow);
        res.status(200).json({ message: 'You have unfollowed the user successfully.' });
    } catch (error) {
        res(error); 
    }

});

followRouter.get('/followers/:userId', validateErrors, async (req, res, next) => {

    try {
        const userId = req.params.userId;
        const followers = await followService.getFollowersByUserId(userId);
        res.json(followers);
    } catch (error) {
        next(error);
    }

});

followRouter.get('/following/:userId', validateErrors, async (req, res, next) => {

    try {
        const userId = req.params.userId;
        const following = await followService.getFollowingByUserId(userId);
        res.json(following);
    } catch (error) {
        next(error);
    }

});

followRouter.get('/followers/count/:userId', validateErrors, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const count = await followService.countFollowers(userId);
        res.status(200).json({ followerCount: count });
      } catch (error) {
        next(error); // Error handling middleware will take care of this
      }
});

followRouter.get('/following/count/:userId', validateErrors, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const count = await followService.countFollowing(userId);
        res.status(200).json({ followingCount: count });
      } catch (error) {
        next(error); // Error handling middleware will take care of this
      }
});







export default followRouter;
