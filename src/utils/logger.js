import { createLogger, format, transports } from 'winston';
const { combine, timestamp, splat, colorize, errors, printf, prettyPrint } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message ? message : "No Message!"} `;

    if (metadata) {
        let stack = "";
        if (metadata["stack"]) {
            stack = metadata["stack"];
            delete metadata["stack"];
        }

        if (Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata, null, 2);
        }

        msg += stack;
    }
    return msg;
});

const consoleFormat = combine(
    colorize(),
    splat(),
    timestamp(),
    errors({ stack: true }),
    prettyPrint(),
    myFormat
);

const fileFormat = combine(
    splat(),
    timestamp(),
    errors({ stack: true }),
    prettyPrint(),
    myFormat
);

const logger = createLogger({
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
            format: consoleFormat
        }),
        new transports.File({ filename: "data/logs/log.log", level: "debug", format: fileFormat })
    ]
});

// logger.js
export default logger;
