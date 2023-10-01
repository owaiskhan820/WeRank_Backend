// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import UserModel from "../../models/user.js"
import { hashPassword } from "../../authentication/authentication.js"; 

class UserService {
  async createUser(userData) {
    try {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      return await instanceOfUserDAO.createUser(userData);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user');
    }
  }

  // Retrieves all users with pagination support
  async getAllUsers(page, perPage) {
    console.log("🚀 ~ file: user.js:20 ~ UserService ~ getAllUsers ~ page:", page, perPage)
    return instanceOfUserDAO.findAllUsers(page, perPage)
  }

  // Retrieves a user by their ID
  async getUserById(userId) {
    try {
      return await instanceOfUserDAO.getUserById(userId);
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving user');
    }
  }

  async createUser(userData) {
    try {
      return await instanceOfUserDAO.createUser(userData);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user');
    }
  }
}

const userService = new UserService();

export default userService;
