import instanceOfListDAO from "../../daos/list/list.js";
import instanceOfProfileDAO from "../../daos/profile/profile.js";
import instanceOfFollowDAO from "../../daos/follow/follow.js";
import instanceOfWatchlistDAO from "../../daos/watchlist/watchlist.js";
import userService from "../user/user.js";
class ListService {
  async saveList(listBody) {
   return await instanceOfListDAO.createList(listBody)
  }

  // Retrieves all users with pagination support
  async getAllLists() {
    try{
      return await instanceOfListDAO.getAllLists()
    } catch(error){
      throw error
    }
  }

  // Retrieves a user by their ID
  async getListByListId(Id) {
    try {
        return await instanceOfListDAO.getListByListId(Id);
    } catch (error) {
        throw error;
    }
}

async getListByUserId(Id) {
  try {
    return await instanceOfListDAO.getListByQuery('userId', Id);
  } catch (error) {
      throw error;
  }
 
}

async getListByCategoryId(Id) {
  try {
    return await instanceOfListDAO.getListByQuery('categoryId', Id);
  } catch (error) {
      throw error;
  }
}

  async deleteListById(Id) {
    try{
      return instanceOfListDAO.deleteListById(Id)
    } catch(error){
      throw error;
    }

  }

  async calculateScores(listItems){
    const maxScore = listItems.length;
    return listItems.map((item, index) => ({
        ...item,
        score: maxScore - index
    }));
  }

  async updateScore(listId, rearrangedItems) {
    const maxScore = rearrangedItems.length;
    console.log(maxScore)
    // Create a score update map based on new positions
    const scoreUpdates = rearrangedItems.map((item, index) => ({
        itemId: item._id,
        scoreIncrement: maxScore - index
    }));

    return await instanceOfListDAO.updateScores(listId, scoreUpdates);
}


  async getListCountByUserId(userId){
    try{
      return await instanceOfListDAO.fetchListCountByUserId(userId);

    } catch(error){
      throw error
    }
  
  };


  async getSuggestedLists(userId) {
    // Fetch the user's followings and interests
    const followings = await instanceOfFollowDAO.getFollowingByUserId(userId);
    const interests = await instanceOfProfileDAO.getInterestsByUserId(userId);

    // Extract following userIds
    const followingUserIds = followings.map(follow => follow.userId);

    // 1. Fetch lists watchlisted by users you follow
    const watchlistedLists = await instanceOfWatchlistDAO.getWatchlistedListsByUserIds(followingUserIds);

    // 2. Fetch lists in similar interest categories
    const interestBasedLists = await instanceOfListDAO.findListsByInterests(interests);

    // 3. Fetch lists created by users your followings are following
    const followingsCreators = await userService.getUsersFollowedByFollowings(followingUserIds);
    const creatorLists = await instanceOfListDAO.findListsByCreators(followingsCreators);

    // Combine all fetched lists
    let combinedLists = [...watchlistedLists, ...interestBasedLists, ...creatorLists];

  
    const uniqueListsMap = new Map();
    combinedLists.forEach(list => {
        // Assuming each list has a unique identifier 'id'
        if (!uniqueListsMap.has(list.id.toString())) {
            uniqueListsMap.set(list.id.toString(), list);
        }
    });

    // Extracting the deduplicated lists
    combinedLists = Array.from(uniqueListsMap.values());
    // Sort combined lists by recency (createdDate)

    const listDetailsPromises = combinedLists.map(async list => {
      const userProfile = await instanceOfProfileDAO.getProfileByUserId(list.userId.toString());
      return {
          listTitle: list.title,
          listId: list.id,
          username: userProfile.username,
          profilePicture: userProfile.profilePicture,
          createdDate: list.createdDate

      };
  });

  const listsDetails = await Promise.all(listDetailsPromises);
  listsDetails.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  return listsDetails;
  }

  deduplicateLists(lists) {
    const uniqueListIds = new Set();
    const uniqueLists = [];

    lists.forEach(list => {
      if (!uniqueListIds.has(list._id.toString())) {
        uniqueLists.push(list);
        uniqueListIds.add(list._id.toString());
      }
    });

    return uniqueLists;
  }


}

const listService = new ListService();

export default listService;


