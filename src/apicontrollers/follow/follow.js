import express  from "express";
import apiHelpers from '../../utils/assets/apiHelpers.js';


const followRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;


followRouter.post('/follow/:userId', validateErrors, async (req, res, next) => {
    // Follow user logic here
});


followRouter.post('/unfollow/:userId', validateErrors, async (req, res, next) => {
    // Unfollow user logic here
});


followRouter.get('/activity-feed', validateErrors, async (req, res, next) => {
    // Get activity feed logic here
});

followRouter.get('/recommendations', validateErrors, async (req, res, next) => {
    // Get user recommendations logic here
});


followRouter.get('/notifications', validateErrors, async (req, res, next) => {
    // Get notifications for the current user logic here
});


followRouter.get('/following/:userId', validateErrors, async (req, res, next) => {
    // Get users that the given user is following logic here
});



export default categoryRouter;
