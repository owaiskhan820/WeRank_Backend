// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import { hashPassword } from "../../authentication/authentication.js"; 
import logger from "../../utils/logger.js";
import { sendVerificationEmail } from "../../authentication/emailVarification.js";
import { generateToken } from "../../authentication/authentication.js";

class UserService {
  async createUser(userData) {
    console.log('entered ser layer 1')
    try {
      //hashing the password
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
     
      //generating email varification token
      console.log("this is the id", userData.id); // Fixed syntax error here

      const token = generateToken(userData)
      userData.emailVerificationToken = token;
     
      //sending varification email
      sendVerificationEmail(userData)
     
      return  instanceOfUserDAO.createUser(userData);
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


}

const userService = new UserService();

export default userService;
