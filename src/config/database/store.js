const mongo = require("connect-mongo");
const { logger } = require("../../util/logger");

let mongoStore = null;

const GetMongoStore = (mongoUrl) => {

    if (mongoStore) {
        logger.info("Using previously created mongo store");
        return mongoStore;
    }

    if (!mongoUrl) {
        throw new Error("need mongo url to create mongo store");
    }

    logger.info("Creating new mongo store");

    mongoStore = mongo.create({
        mongoUrl: mongoUrl
    });

    return mongoStore;
};

module.exports = GetMongoStore;
