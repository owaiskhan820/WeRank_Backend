import ProfileModel from "../../models/profile/profie.js";

class ProfileDAO{

    async getProfileByUserId(userId) {
        try {
            // Assuming ProfileModel has a reference to UserModel via 'userId'
            const profileWithUser = await ProfileModel.findOne({ userId: userId })
                .populate('userId', 'username'); // Populate the 'userId' field with 'username' from UserModel
    
            if (!profileWithUser) {
                return null; // Or handle the case where the profile is not found
            }
    
            // Return both profile information and username
            return {
                ...profileWithUser.toObject(), // Convert Mongoose document to plain object
                username: profileWithUser.userId.username // Include the username from the populated user document
            };
    
        } catch (error) {
            throw error;
        }
    }


    async createProfile(profileData) {
            console.log("entered DAO layer", profileData)
            const profile = new ProfileModel(profileData);
            return await profile.save();
        } catch (error) {
            throw error;
        }
    

    async updateUserProfile(userId, userInfo) {
        try {
            return await ProfileModel.findOneAndUpdate(
                { userId: userId },
                userInfo,
                { new: true } // Return the updated document
            );
        } catch (error) {
            console.error('Error updating user profile in DAO:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
     
    }

    async getProfilePictureById(userId) {
        // Assuming mongoose and a ProfileModel is already defined
        const profile = await ProfileModel.findOne({ user: userId }, 'pictureUrl');
        return profile ? profile.pictureUrl : null;
      }


      findUsersWithInterestsQuery(interests) {
        // Return the query object without executing it
        return ProfileModel.find({ interests: { $in: interests } });
    }
    
      async getInterestsByUserId(userId) {
        const profile = await ProfileModel.findOne({ userId: userId });
        if (!profile) {
            // Handle the case where the profile doesn't exist for the user
            throw new Error(`Profile not found for user with ID ${userId}`);
        }
        return profile.interests;
    }

    
    // Function to get all profiles
    async getAllProfiles() {
        try {
            return await ProfileModel.find({}).exec();
        } catch (error) {
            throw error;
        }
    }


    
    
    }
    
    const instanceOfProfileDAO  = new ProfileDAO();
    
    export default instanceOfProfileDAO;