// Data Access Object (DAO) for handling user-related database operations.
import UserModel from '../../models/user.js';
import applyPagination from '../../utils/assets/pagination.js';

class UserDAO {
   async findAllUsers(page = 1, perPage = 10) {
    const users = await applyPagination(UserModel.find(), page, perPage);
    return users;
  }
}

const instanceOfUserDAO = new UserDAO();

export default instanceOfUserDAO;
