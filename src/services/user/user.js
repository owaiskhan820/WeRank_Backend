// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import { hashPassword } from "../../authentication/authentication.js"; 
import logger from "../../utils/logger.js";
import { sendEmail } from "../../authentication/emailVarification.js";
import { generateToken } from "../../authentication/authentication.js";
import bcrypt from 'bcrypt';

class UserService {
  async createUser(userData) {
    try {
      //hashing the password
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
     
      const token = generateToken(userData)
      userData.emailVerificationToken = token;
     
      //sending varification email
      sendEmail(userData, 'verification')
     
      return  instanceOfUserDAO.createUser(userData);
    } 
    catch (error) {
      console.error(error);
      throw new Error('Error creating user');
    }
  }

  async validateUser(userData, res){
    try {
      // Find user with matching email in the database
      const user = await instanceOfUserDAO.userExists(userData.email)
  
      // If user not found, send appropriate response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(userData.password, user.password);

        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If user is found and password is valid, generate a token
      const token = generateToken(user);
  
      // Send success response with token
      return res.status(200).json({ message: 'User authenticated successfully', token });
  
    } catch (error) {
      // Log the error for debugging purposes
      console.error(error);
  
      // Send a 500 status code and error message
      return res.status(500).json({ message: 'Internal server error' });
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
