// Data Access Object (DAO) for handling user-related database operations.
import UserModel from '../../models/user.js';
import applyPagination from '../../utils/assets/pagination.js';

class UserDAO {
  async findAllUsers(page = 1, perPage = 10) {
    const users = await applyPagination(UserModel.find(), page, perPage);
    return users;
  }

  async createUser(userData) {
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user in database');
    }
  }

  async getUserByEmail(email){
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new Error('User not found');
    return user;
  }

  async userExists(email){ 
    const user = await UserModel.findOne({ email: email });
    return user;
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
