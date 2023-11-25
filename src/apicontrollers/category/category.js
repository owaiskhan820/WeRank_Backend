import express  from "express";
import categoryService from "../../services/category/category.js";
import { categoryValidationSchema } from "../../utils/requestValidaton/category.js";
import apiHelpers from '../../utils/assets/apiHelpers.js';


const categoryRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;


categoryRouter.post('/add-category', categoryValidationSchema, validateErrors, async (req, res, next) => {
    const category = req.body.categoryName;
    try {
        const newCategory = await categoryService.addCategory(category);
        res.status(200).json(apiOk({"categories": newCategory}));
    } catch (err) {
        next(err); 
    }
});

categoryRouter.delete('/delete-category/:id', async (req, res) => {
    try {
        const deletedCategory = await categoryService.deleteCategory(req.params.id);

        if (!deletedCategory) {
            res.status(404).json({ msg: "Category not found" });
        } else {
            res.status(200).json({ msg: "Category deleted successfully", deletedCategory });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the category" });
    }
});


categoryRouter.get('/getAll', async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        console.log(categories)
        res.status(200).json({ categories });
    } catch (err) {
        next(err);   
    }
});

categoryRouter.get('/getCategory/:id', async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json(apiOk({ msg: "Category not found" }));
        }

        res.status(200).json(apiOk({ category }));
    } catch (err) {
        next(err);   
    }
});


export default categoryRouter;
