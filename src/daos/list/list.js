// Data Access Object (DAO) for handling list-related database operations.
import ListModel from '../../models/list/list.js';
import applyPagination from '../../utils/assets/pagination.js';
import VoteModel from '../../models/list/vote.js';
import ContributorModel from '../../models/list/contributor.js';

class ListDAO {


    async createList(listData) {
        try {
          console.log(listData);
          const newList = new ListModel(listData);
          return await newList.save();
    
       } catch (error) {
          console.error(error);
          throw new Error('Error creating list');
       }
      }

      async getAllLists() {
        try {
            return await ListModel.find();
        } catch (error) {
            console.error("Error retrieving all lists:", error);
            throw new Error('Database error: Unable to retrieve lists');
        }
    }
     
      async getListByListId(Id, page = 1, perPage = 10) {
        try {
          const query = ListModel.findById(Id);
          return await query;
        } catch (error) {
          console.error(error);
          throw new Error('Error retrieving list from database');
        }
      }
      async getListByQuery(queryParam, value, page = 1, perPage = 10) {
        try {
            let query;
            if (queryParam === 'userId') {
                query = ListModel.find({ userId: value });
            } else if (queryParam === 'categoryId') {
                query = ListModel.find({ categoryId: value });
            } else if (queryParam === 'id') {
                query = ListModel.findById(value);
            } else {
                throw new Error('Invalid query parameter');
            }
    
            return await applyPagination(query, page, perPage);
        } catch (error) {
            console.error(error);
            throw new Error('Error retrieving list from database');
        }
    }

    // In your ListDAO class or object
    async deleteListById(listId) {
      try {
          const result = await ListModel.findByIdAndDelete(listId);
          if (!result) {
              throw new Error(`List with ID ${listId} not found`);
          }
          return result;
      } catch (error) {
          console.error(error);
          throw new Error('Error deleting list from database');
      }
    }


    async getListByTitle(title, page = 1, perPage = 10) {
      try {
        const query = ListModel.findOne({ name: title }).populate('items');
        return await applyPagination(query, page, perPage);
      } catch (error) {
        console.error(error);
        throw new Error('Error retrieving list by name from database');
      }
    }


  async updateList(listId, updatedData) {
    try {
      const updatedList = await ListModel.findByIdAndUpdate(listId, updatedData, { new: true }).populate('items');
      return updatedList;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating list in database');
    }
  }

  async addVote(userId, listId, voteType){
    list = await ListModel.find({ ListId: listId });
    if(!list){
      throw new Error('List does not exist') 
    }

    try {
      const vote = new VoteModel({
          userId: userId,
          listId: listId,
          voteType: voteType
      });

      return await vote.save();
  } catch (error) {
      throw error; // This will propagate the error up to be caught by the caller
  }

  }


    async incrementVoteCount(listId, voteType){
  
      let voteChanges = {};

      if (voteType === 'upvote') {
          voteChanges = { upVotes: 1 };
      } else if (voteType === 'downvote') {
          voteChanges = { downVotes: 1 };
      } else {
          throw new Error('Invalid vote type');
      }
  
      return await ListModel.findByIdAndUpdate(listId, { $inc: voteChanges }, { new: true });
    }

    async switchVoteCount(listId, voteType){
  
      let voteChanges = {}; 
      console.log(voteType)

      if (voteType === 'upvote') {
          voteChanges = { downVotes: -1, upVotes: 1 };
      } else if (voteType === 'downvote') {
          voteChanges = { upVotes: -1, downVotes: 1 };
      } else {
          throw new Error('Invalid vote type');
      }
      console.log(voteChanges)
      return await ListModel.findByIdAndUpdate(listId, { $inc: voteChanges }, { new: true });
  }


  async updateScores(listId, scoreUpdates) {
    const list = await ListModel.findById(listId);

    // For each item in the list, update its score
    for (const item of list.listItems) {
      const update = scoreUpdates.find(s => s.itemId === item._id.toString());
      if (update) {
            item.score += update.scoreIncrement;
        }
    }
    list.listItems.sort((a, b) => b.score - a.score);
    return await list.save();
   
}
  }    

const instanceOfListDAO = new ListDAO();

export default instanceOfListDAO;
