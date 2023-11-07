import express from 'express'
import { authMiddleware } from '../../authentication/authentication.js';
import profileService from '../../services/profile/profile.js';



const profileRouter = express.Router();




profileRouter.post('/update-user-info', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id;
        let profileData = { ...req.body };
        profileData.userId = userId;

        
        const user = await profileService.getProfileByUserId(userId)
        if(!user){
            const newProfile = await profileService.createUserProfile(profileData)
            return res.status(200).send({ message: 'Profile created successfully!', Profile:  newProfile});
        }
        const updatedProfile = await profileService.updateUserProfile(userId, profileData);
  

        return res.status(200).send({ message: 'Profile updated successfully!', Profile:  updatedProfile});
    } catch (error) {
        next(error);
    }
});



profileRouter.get('/get-by-userId', async (req, res, next) => {
    try {
        const userId = req.query.userId;
        console.log(req.query.userId)
        const profile = await profileService.getProfileByUserId(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
});


profileRouter.get('/getAll', async (req, res, next) => {
    try {
        const result = await profileService.getAllProfiles();
        if (!result) {
            return res.status(404).json({ message: 'No Profiles found.' });
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
});


// **Activity**
// Endpoint to retrieve user activity
profileRouter.get('/profile/activity', (req, res, next) => {
    // ... code to get user's recent activity
});

// **Settings**
// Endpoint to update profile settings
profileRouter.put('/profile/settings', (req, res, next) => {
    // ... code to handle user settings
});

export default profileRouter;
