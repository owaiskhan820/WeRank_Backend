import mongoose from 'mongoose';
import ContributorSchema from '../../schemas/list/contributor.js';

const ContributorModel = mongoose.model('Contributor', ContributorSchema);

export default ContributorModel;
