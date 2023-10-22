
import CategoryModel from "../../models/category/category.js";

class CategoryDAO{
    async saveCategory(category){
        const newCategory = new CategoryModel({categoryName: category});
        await newCategory.save();
        return newCategory;
    }

    async deleteCategory(id) {
        try {
            return await CategoryModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting category:", error);
            return { error: 'Error deleting category' };
        }
    }
    
    async getCategoryById(id) {
        try {
            return await CategoryModel.findById(id);
        } catch (error) {
            console.error("Error retrieving category by ID:", error);
            return { error: 'Error retrieving category by ID' };
        }
    }
    
    async getAllCategories() {
        try {
            return await CategoryModel.find();
        } catch (error) {
            console.error("Error retrieving all categories:", error);
            return { error: 'Error retrieving all categories' };
        }
    }
    
    async updateCategory(id, updatedCategory) {
        try {
            return await CategoryModel.findByIdAndUpdate(id, { categoryName: updatedCategory }, { new: true });
        } catch (error) {
            console.error("Error updating category:", error);
            return { error: 'Error updating category' };
        }
    }
    
    
}

const instanceOfCategoryDAO = new CategoryDAO()
export default instanceOfCategoryDAO;