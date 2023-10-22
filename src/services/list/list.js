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

}

const listService = new ListService();

export default listService;


