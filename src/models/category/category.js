import mongoose from 'mongoose';
import categorySchema from '../../schemas/category/category.js';

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;

