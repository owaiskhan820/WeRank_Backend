import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ContributorSchema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose that this field relates to the User collection
        required: true
    },
    contributedAt: {
        type: Date,
        default: Date.now
    }
});

export default ContributorSchema