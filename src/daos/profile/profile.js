import ProfileModel from "../../models/profile/profie.js";

class ProfileDAO{

    async getProfileByUserId(userId) {
        try {
            // Assuming ProfileModel has a reference to UserModel via 'userId'
            const profileWithUser = await ProfileModel.findOne({ userId: userId })
                                                        .populate('userId', 'username')  
                                                        .populate('interests', 'categoryName');  
                                                            
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



    async updateProfilePicture(userId, imageUrl) {
        try {
            console.log("Updating profile picture in DAO layer", userId, imageUrl);
    
            // Find the profile by userId and update the profilePicture field
            const updatedProfile = await ProfileModel.findOneAndUpdate(
                { userId: userId },  // Query based on the 'userId' field in the profile schema
                { profilePicture: imageUrl },
                { new: true, runValidators: true }
            );
    
            if (!updatedProfile) {
                throw new Error(`Profile not found for user ID: ${userId}`);
            }
    
            return updatedProfile;
        } catch (error) {
            // Log the error or handle it as needed
            console.error("Error updating profile picture:", error);
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
        const profile = await ProfileModel.findOne({ userId: userId }, 'profilePicture bio');
        if (profile) {
            return {
                pictureUrl: profile.profilePicture, // Use the correct field name from the schema
                bio: profile.bio
            };
        } else {
            return {
                pictureUrl: null,
                bio: null
            };
        }
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