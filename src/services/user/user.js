// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import { hashPassword } from "../../authentication/authentication.js"; 
import { generateToken } from "../../authentication/authentication.js";
class UserService {
  async createUser(userData) {
    try {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      const emailVerificationToken = generateToken(userData)
      userData.emailVerificationToken = emailVerificationToken
      
      return await instanceOfUserDAO.createUser(userData);

    } catch (error) {
      console.error(error);
      throw new Error('Error creating user');
    }
  }

  // Retrieves all users with pagination support
  async getAllUsers() {
    return await instanceOfUserDAO.findAllUsers()
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

  
  async saveUser(userDetails) {
    return await instanceOfUserDAO.createUser(userDetails);
}

  async getUserByEmail(email){
    return await instanceOfUserDAO.getUserByEmail(email) 
   }


  async deleteUserById(userId) {
    // Assuming you're using Mongoose (as it appears so in your other methods)
    return instanceOfUserDAO.deleteUserById(userId);
}


}

const userService = new UserService();

export default userService;
