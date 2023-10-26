import instanceOfListDAO from "../../daos/list/list.js";

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

}

const listService = new ListService();

export default listService;


