import mongoose from 'mongoose';
import listSchema from '../../schemas/list/list.js';

const ListModel = mongoose.model('List', listSchema);

export default ListModel;
