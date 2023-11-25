import express from 'express'
import { authMiddleware } from '../../utils/authentication/authentication.js'
import profileService from '../../services/profile/profile.js';
import categoryService from '../../services/category/category.js';
import userService from '../../services/user/user.js';

const profileRouter = express.Router();




profileRouter.post('/update-profile', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const profileData = { ...req.body, userId }; // Includes interests and other profile data
  
      const profile = await profileService.getProfileByUserId(userId);
  
      // Update the profile
      const updatedProfile = await profileService.updateUserProfile(userId, profileData);
      return res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
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


profileRouter.post('/add-interest', authMiddleware, async (req, res) => {
    try {
      // Fetch the user's profile instead of the user
      const userId = req.user.id
      const profile = await profileService.getProfileByUserId(userId);
    
      const interestId = req.body.interestId;
      const category = await categoryService.getCategoryById(interestId);
      
      if (!category) {
        return res.status(404).json({ error: 'Interest does not exist' });
      }
    
      // Check if the interest already exists in the profile
      const exists = profile.interests.includes(interestId);
      
      if (exists) {
        return res.status(400).json({ error: 'Interest already exists' });
      }
      
      // Add the new interest to the profile's interests array
      profile.interests.push(interestId);
      
      // Save the updated profile
      await profileService.updateUserProfile(userId, profile);
      
      res.status(200).json({ message: 'Interest successfully updated', profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  


  profileRouter.post('/delete-interest', authMiddleware, async (req, res) => {
    try {
    const userId = req.user.id;
    const profile = await profileService.getProfileByUserId(req.user.id);

    const interestId  = req.body.interestId;

    const filteredInterests = profile.interests.filter(category => {
      const categoryIdAsString = category._id.toString();
      return categoryIdAsString !== interestId;
  });
  
   console.log(filteredInterests)
    profile.interests = filteredInterests;
    // Save the updated user
    const newProfile = await profileService.updateUserProfile(userId, profile);

    res.status(200).json({ msg: "Interest deleted successfully", userProfile: newProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

profileRouter.post("/get-interests", authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId;
        const profile = await profileService.getProfileByUserId(userId);
        
        if (!profile) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const userInterests = profile.interests;
        res.status(200).json({"interests": userInterests});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
