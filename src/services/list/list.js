import instanceOfListDAO from "../../daos/list/list.js";
import instanceOfProfileDAO from "../../daos/profile/profile.js";
import instanceOfFollowDAO from "../../daos/follow/follow.js";
import instanceOfWatchlistDAO from "../../daos/watchlist/watchlist.js";
import userService from "../user/user.js";
import instanceOfVoteDAO from "../../daos/vote/vote.js";
import instanceOfCommentDAO from "../../daos/comment/comment.js";
import query from '../../huggingFace/sentimentAnalyzer.js';
import notificationService from '../../services/notifications/notifications.js'



class ListService {

  async saveList(listBody) {
    try {
      const response = await instanceOfListDAO.createList(listBody);

      const actionUser = response.userId;
      const actionType = 'newPost';
      const actionId = response._id; 

     
  
      await notificationService.notify(actionUser, actionType, actionId);
  
      return response;
    } catch (error) {
      console.error('Error in saveList method:', error);
      throw error; // Or handle it as per your application's error handling strategy
    }
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
      return await instanceOfListDAO.getListByQuery('id', Id);
    } catch (error) {
        throw error;
    }
}


async getListByUserId(userId) {
  try {
    return await instanceOfListDAO.getListByQuery('userId', userId);
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
    const scoreUpdates = rearrangedItems.map((item, index) => ({
        itemId: item._id,
        scoreIncrement: maxScore - index
    }));

    try{
       return await instanceOfListDAO.updateScores(listId, scoreUpdates);
    }
    catch(error){
      throw error
    }
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
  
    // Extract following userIds and convert to string for comparison
    const followingUserIds = followings.map(follow => follow.userId.toString());
  
    // 1. Fetch lists watchlisted by users you follow
    let watchlistedLists = await instanceOfWatchlistDAO.getWatchlistedListsByUserIds(followingUserIds);
    watchlistedLists = this.deduplicateAndFilterLists(watchlistedLists, userId, followingUserIds);
  
    // 2. Fetch lists in similar interest categories
    let interestBasedLists = await instanceOfListDAO.findListsByInterests(interests);
    interestBasedLists = this.deduplicateAndFilterLists(interestBasedLists, userId, followingUserIds);
  
    // 3. Fetch lists created by users your followings are following
    let followingsCreators = await userService.getUsersFollowedByFollowings(followingUserIds);
    let creatorLists = await instanceOfListDAO.findListsByCreators(followingsCreators);
    creatorLists = this.deduplicateAndFilterLists(creatorLists, userId, followingUserIds);
  
    // Combine all filtered lists
    const combinedLists = [...watchlistedLists, ...interestBasedLists, ...creatorLists];
  
    // Retrieve additional details for the lists
    const listsDetails = await Promise.all(combinedLists.map(async list => {
      const userProfile = await instanceOfProfileDAO.getProfileByUserId(list.userId.toString());
      return {
        userId: list.userId,
        listTitle: list.title,
        listId: list.id,
        username: userProfile.username,
        profilePicture: userProfile.profilePicture,
        createdDate: list.createdDate
      };
    }));
  
    // Sort combined lists by recency
    listsDetails.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  
    return listsDetails;
  }
  
  deduplicateAndFilterLists(lists, userId, followingUserIds) {
    const uniqueListIds = new Set();
    const filteredLists = [];
  
    lists.forEach(list => {
      const listOwnerId = list.userId.toString();
      if (!uniqueListIds.has(list._id.toString()) && listOwnerId !== userId && !followingUserIds.includes(listOwnerId)) {
        filteredLists.push(list);
        uniqueListIds.add(list._id.toString());
      }
    });
  
    return filteredLists;
  }
  


  async getListsByIds(listIds) {
    try {
      // Fetch lists that match the list of IDs
      const lists = instanceOfListDAO.getListsByIds(listIds)
      return lists;
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }


   calculateTimeDiffInDays(createdAt) {
    const createdAtDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate - createdAtDate;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    return diffInDays;
}

 normalizeScore(score, minPossibleScore, maxPossibleScore) {
    // Ensure the score is within the bounds
    if (score < minPossibleScore) score = minPossibleScore;
    if (score > maxPossibleScore) score = maxPossibleScore;

    // Normalize the score to a 5-point scale
    const finalScore =  5 * (score - minPossibleScore) / (maxPossibleScore - minPossibleScore);
    return(finalScore)
}


calculateDecayFactor(createdAt, decayConstant) {
  

    const timeNow = new Date();
    const timeOfInteraction = new Date(createdAt);
    const timeDiff = (timeNow - timeOfInteraction) / (1000 * 60 * 60 * 24); // Time difference in days
    return Math.exp(-decayConstant * timeDiff);
  }


  calculateVoteScore(votes, decayConstant) {
    // Check if votes is not an array
    if (votes.length === 0) {


      return 0; // or 'N/A', or any default value you choose
    }
  
   else{ let voteScore = 0;
    for (const vote of votes) {
      const decayFactor = this.calculateDecayFactor(vote.createdAt, decayConstant);
      const voteValue = (vote.voteType === 'upvote') ? 1 : -1;
      voteScore += voteValue * decayFactor;
    }
  
    return voteScore;}
  }
  



  async calculateCommentScore(comments, decayConstant) {
    // Check if comments is not an array
    if (comments.length === 0) {


      return 0; // or 'N/A', or any default value you choose
    }

    let commentScore = 0;
    const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; 
    for (const comment of comments) {
      const decayFactor = this.calculateDecayFactor(comment.createdAt, decayConstant);
      const sentimentResult = await query({ "inputs": comment.text }, API_TOKEN);
      const sentimentValue = this.interpretSentimentResult(sentimentResult); // Assuming this returns 1, -1, or 0
      commentScore += sentimentValue * decayFactor;
    } 

    return commentScore;
  }




combineAndScaleScores(voteScore, commentScore) {
  const combinedScore = (voteScore + commentScore) / 2;
  
  // Scale from a -1 to 1 range to a 0 to 5 range
  return (combinedScore + 1) * 2.5;
}

 interpretSentimentResult(result) {
  if (result && result.length > 0) {
      const sentiments = result[0];

      // Assuming the response structure includes an array of sentiment objects with 'label' and 'score'
      const primarySentiment = sentiments.sort((a, b) => b.score - a.score)[0]; // Sort by score and take the highest

      if (primarySentiment.label === 'POSITIVE') {
          return 1;
      } else if (primarySentiment.label === 'NEGATIVE') {
          return -1;
      }
  }
}

 scaleToFivePointRange(score) {
  // Scale from -1 to 1 range to 0 to 5 range
  return (score + 1) * 2.5;
}

 async calculateListScore(listId) {
  const votesData = await instanceOfVoteDAO.FindVoteByListId(listId);
  const commentsData = await instanceOfCommentDAO.FindCommentDetailsByListId(listId);

  const votes = Array.isArray(votesData.voteDetails) ? votesData.voteDetails : [];
  const comments = Array.isArray(commentsData.commentDetails) ? commentsData.commentDetails : [];

  const voteScore = this.calculateVoteScore(votes, 0.3);
  const commentScore = await this.calculateCommentScore(comments, 0.3);

  const combinedScore = (voteScore + commentScore) / (votes.length + comments.length);

  const scaledScore = this.scaleToFivePointRange(combinedScore);

  return scaledScore;

}
}

const listService = new ListService();

export default listService;


