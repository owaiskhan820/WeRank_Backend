// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import UserModel from "../../models/user.js"

class UserService {
  // Creates a new user and saves it to the database
  async createUser(userData) {
    const newUser = new UserModel(userData);
    await newUser.save();
    return newUser;
  }

  // Retrieves all users with pagination support
  async getAllUsers(page, perPage) {
    console.log("🚀 ~ file: user.js:20 ~ UserService ~ getAllUsers ~ page:", page, perPage)
    return instanceOfUserDAO.findAllUsers(page, perPage)
  }
}

const userService = new UserService();

export default userService;
