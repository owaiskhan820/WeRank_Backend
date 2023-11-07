import ProfileModel from "../../models/profile/profie.js";

class ProfileDAO{

    async getProfileByUserId(userId) {
        try {
            const result = await ProfileModel.findOne({ userId: userId });
            return result;
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
            return await ProfileModel.findOneAndUpdate({ userId: userId }, userInfo, { new: true });
        } catch (error) {
            throw error;
        }
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