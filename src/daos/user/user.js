// Data Access Object (DAO) for handling user-related database operations.
import UserModel from '../../models/user.js';
import applyPagination from '../../utils/assets/pagination.js';

class UserDAO {

  async findAllUsers() {
    try {
      const users = await UserModel.find().populate('interests');
      return users;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving users from database');
    }
  }

  async getUserById(userId) {
    try {
      const user = await UserModel.findById(userId).populate('interests');
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving user from database');
    }
  }

  async deleteUserById(userId) {
    // Assuming you're using Mongoose (as it appears so in your other methods)
    return await UserModel.findByIdAndDelete(userId).populate('interests');
}

  async createUser(userData) {
    try {
      const newUser = new UserModel(userData);
      await newUser.save();

      // If you want the populated interests to be returned:
      const populatedUser = await UserModel.findById(newUser._id).populate('interests');
      return populatedUser;

   } catch (error) {
      console.error(error);
      throw new Error('Error creating user');
   }
  }

  async getUserByEmail(email){
    const user = await UserModel.findOne({ email: email }).populate('interests');
    if (!user) throw new Error('User not found');
    return user;
  }


  async updateUser(userId, updatedData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true }).populate('interests');
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user in database');
    }
  }
}

const instanceOfUserDAO = new UserDAO();

export default instanceOfUserDAO;
