// Data Access Object (DAO) for handling user-related database operations.
import UserModel from '../../models/user/user.js';
import ProfileModel from '../../models/profile/profie.js';
import ListModel from '../../models/list/list.js';
import WatchlistModel from '../../models/watchlist/watchlist.js';
import FollowModel from '../../models/follow/follow.js';
import mongoose from 'mongoose'
class UserDAO {

  async findAllUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving users from database');
    }
  }

  async getUserById(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving user from database');
    }
  }

  async deleteUser(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Delete the user's profile
      await ProfileModel.findOneAndDelete({ userId: userId }, { session });
      // Delete the user's lists
      await ListModel.deleteMany({ createdBy: userId }, { session });
      // Delete the user's watchlist entries
      await WatchlistModel.deleteMany({ userId: userId }, { session });
      // ... Add other delete operations for related collections
      await FollowModel.deleteMany({ userId: userId }, { session });


      // Delete the user
      await UserModel.findByIdAndDelete(userId, { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error; // Rethrow the error so it can be handled by the caller
    } finally {
      // End the session
      session.endSession();
    }
  }


  async createUser(userData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const newUser = new UserModel(userData);
      const savedUser = await newUser.save({ session });
      
      // Create an empty profile for the new user with only the userId field populated
      const newProfile = new ProfileModel({ userId: savedUser._id });
      await newProfile.save({ session });

      await session.commitTransaction();
      
      return savedUser;
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw new Error('Error creating user and profile');
    } finally {
      session.endSession();
    }
  }

  async getUserByEmail(email){
    return await UserModel.findOne({ email: email });
}

  async getUserByResetToken(resetToken) {
    try {
      const user = await UserModel.findOne({ passwordResetToken: resetToken });
      return user;
    } catch (error) {
      throw new Error('Error accessing the database');
    }}

    async getUsernameById(userId) {
      const user = await UserModel.findById(userId, 'username firstName lastName');
      if (!user) return null;
    
      // Return an object with the username and additional information
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }


  async updateUser(userId, updatedData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user in database');
    }
  }


  
}

const instanceOfUserDAO = new UserDAO();

export default instanceOfUserDAO;
