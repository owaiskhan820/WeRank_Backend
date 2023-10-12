import mongoose from 'mongoose';
import categorySchema from '../schemas/categorySchema.js';

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;

