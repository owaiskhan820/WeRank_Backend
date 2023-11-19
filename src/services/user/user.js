// Assuming you have a UserModel and any necessary dependencies imported
import instanceOfUserDAO from "../../daos/user/user.js";
import instanceOfProfileDAO from "../../daos/profile/profile.js"
import instanceOfFollowDAO from "../../daos/follow/follow.js";
import { hashPassword, generateToken } from "../../utils/authentication/authentication.js"; 
import { sendEmail } from "../../utils/authentication/emailVarification.js";
import applyPagination from "../../utils/assets/pagination.js"
class UserService {


  async createUser(userData) {
    const existingUser = await instanceOfUserDAO.getUserByEmail(userData.email);
    if (existingUser) {
        throw new Error("Email already taken");
    }

    const hashedPassword = await hashPassword(userData.password);
    userData.password = hashedPassword;
    const emailVerificationToken = generateToken(userData);
    userData.emailVerificationToken = emailVerificationToken;

    try {
        const newUser = await instanceOfUserDAO.createUser(userData);
        await sendEmail(newUser, 'verification');
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
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

  async getUserByResetToken(resetToken) {
    try {
      const user = await instanceOfUserDAO.getUserByResetToken(resetToken);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfileById(userId) {
    const username = await instanceOfUserDAO.getUsernameById(userId);
    const profilePicture = await instanceOfProfileDAO.getProfilePictureById(userId);

    return {
      username,
      profilePicture 
    };
  }

  
  async getUsersByInterests(interests) {
    // This method needs to cross-reference interests with user profiles
    const profiles = await ProfileModel.find({ interests: { $in: interests } });
    const userIds = profiles.map(profile => profile.user);

    // Fetch usernames and profile pictures for each user ID
    return Promise.all(userIds.map(async userId => {
      return this.getUserCredentials(userId);
    }));
  }


  async getUsersFollowedByFollowings(followingUserIds) {
    let followingsOfFollowings = [];
    for (let followingId of followingUserIds) {
      try {
        const allFollowings = await instanceOfFollowDAO.getFollowingByUserId(followingId);
        // Extract userIds if necessary
        const userIds = allFollowings.map(following => following.userId);
        followingsOfFollowings.push(...userIds);
      } catch (error) {
        console.error(`Error fetching followings for userId ${followingId}:`, error);
        // Handle or throw the error as per your application's error handling strategy
      }
    }
    const uniqueUserIds = [...new Set(followingsOfFollowings)];
    return uniqueUserIds;
  }

  async getSuggestedUsersToFollow(userId, page = 1, perPage = 2) {
    // Get interests of the user
    const interests = await instanceOfProfileDAO.getInterestsByUserId(userId);
    if (!interests) {
      throw new Error(`User has no interests yet`);
    }
  
    const usersWithSimilarInterestsQuery = instanceOfProfileDAO.findUsersWithInterestsQuery(interests);

    // const { data: usersWithSimilarInterests } = await applyPagination(usersWithSimilarInterestsQuery, page, perPage);

    const usersWithSimilarInterests = await usersWithSimilarInterestsQuery.exec()
  

    const idsOfUsersWithSimilarInterestsQuery = usersWithSimilarInterests.map(profile => profile.userId);
  
    const currentUsersFollowings = await instanceOfFollowDAO.getFollowingByUserId(userId);
  
    const followingUserIds = currentUsersFollowings.map(follow => follow.userId);

    const followingsOfFollowings = await this.getUsersFollowedByFollowings(followingUserIds)
  

  const followingsOfFollowingsIds = followingsOfFollowings.map(follow => follow.userId);

  // Combine and deduplicate userIds
      const compiledSuggestions = new Set([
        ...idsOfUsersWithSimilarInterestsQuery.map(id => id.toString()), 
        ...followingsOfFollowings.map(id => id.toString())
    ]);


    const allSuggestedUserIds = Array.from(compiledSuggestions);


  const suggestedUsersInfoPromises = Array.from(allSuggestedUserIds).map(id => {
    return this.getUserProfileById(id.toString());
  });

  const suggestedUsersInfo = await Promise.all(suggestedUsersInfoPromises);

  // Return the profiles along with pagination for the top-level call
  return {
    users: suggestedUsersInfo,
    pagination: {
      currentPage: page,
      perPage: perPage,
      // Include additional pagination details as needed
    }    
  };
  }
  



  async saveUser(userDetails) {
    return await instanceOfUserDAO.updateUser(userDetails);
}

  async getUserByEmail(email){
    return await instanceOfUserDAO.getUserByEmail(email) 
   }


  async deleteUserById(userId) {
    return instanceOfUserDAO.deleteUser(userId);
}


}

const userService = new UserService();

export default userService;
