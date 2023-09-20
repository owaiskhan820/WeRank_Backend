import logger from '../../utils/logger.js';
import mongoose from "mongoose";

const DBConnect = async (mongoUrl) => {
    const connectionP = new Promise((res, rej) => {
        mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            (ins) => {
                logger.info("Mongo connected!!!");
                logger.info(`Using mongo host '${mongoose.connection.host}' and port '${mongoose.connection.port}'`);
                return res(ins);
            },
        ).catch(err => {
            logger.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
            return rej(err);
        });

    });

    return connectionP;
};

export default DBConnect;
