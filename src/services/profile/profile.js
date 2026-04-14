
import instanceOfProfileDAO from "../../daos/profile/profile.js";

class ProfileSerive{

    async getProfileByUserId(userId) {
        try {
            return await instanceOfProfileDAO.getProfileByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    async createUserProfile(profileData) {
        try {
            const profile = await instanceOfProfileDAO.getProfileByUserId(profileData.userId);
            if (profile) {
                throw new Error('Profile already exists for this user.');
            }
            return await instanceOfProfileDAO.createProfile(profileData);
        } catch (error) {
            throw error;
        }
    }

    async updateUserProfile(userId, userInfo){
        try {
            return await instanceOfProfileDAO.updateUserProfile(userId, userInfo)
        } catch (error) {
            throw error;
        }
    };


    async  getProfileByUserId(userId) {
        return instanceOfProfileDAO.getProfileByUserId(userId);
    }
    
    // Method for getting all profiles
    async getAllProfiles() {
        return instanceOfProfileDAO.getAllProfiles();
    }

    async updateProfilePicture(userId, imageUrl) {
        try {
            console.log("Service layer: Updating profile picture", userId, imageUrl);

            const response = await instanceOfProfileDAO.updateProfilePicture(userId, imageUrl)
            if (!response) {
                throw new Error(`Profile not found for user ID: ${userId}`);
            }

            return response;
        } catch (error) {
            console.error("Service layer: Error updating profile picture", error);
            throw error;
        }
    }

}

const profileService = new ProfileSerive();

export default profileService;