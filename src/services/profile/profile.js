
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

}

const profileService = new ProfileSerive();

export default profileService;