import mongoose from 'mongoose';

async function handleCascadingDelete(operations) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      for (const op of operations) {
        switch (op.type) {
          case 'deleteOne':
            await op.model.deleteOne({ _id: op.id }, { session });
            break;
          case 'deleteMany':
            await op.model.deleteMany(op.filter, { session });
            break;
          case 'updateMany':
            await op.model.updateMany(op.filter, op.update, { session });
            break;
          default:
            throw new Error(`Unsupported operation type: ${op.type}`);
        }
      }
  
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  export default handleCascadingDelete;
  