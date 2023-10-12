
import instanceOfCategoryDAO from "../../daos/category/category.js";

class CategoryService{
    async addCategory(category){
        const newCategory = await instanceOfCategoryDAO.saveCategory(category)
        return newCategory
    }

    async deleteCategory(id){
        const response = await instanceOfCategoryDAO.deleteCategory(id)
        return response;
    }

    async getCategoryById(id){
        const response = await instanceOfCategoryDAO.getCategoryById(id)
        return response;
    }

    async getAllCategories() {
        return await instanceOfCategoryDAO.getAllCategories();
    }
}


const categoryService = new CategoryService()
export default categoryService;