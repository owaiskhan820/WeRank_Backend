
import CategoryModel from "../../models/category.js";

class CategoryDAO{
    async saveCategory(category){
        const newCategory = new CategoryModel({categoryName: category});
        await newCategory.save();
        return newCategory;
    }

    async deleteCategory(id) {
        return await CategoryModel.findByIdAndDelete(id);
    }

    async getCategoryById(id) {
        return await CategoryModel.findById(id);
    }

    async getAllCategories() {
        return await CategoryModel.find();
    }

    async updateCategory(id, updatedCategory) {
        return await CategoryModel.findByIdAndUpdate(id, { categoryName: updatedCategory }, { new: true });
    }
}

const instanceOfCategoryDAO = new CategoryDAO()
export default instanceOfCategoryDAO;