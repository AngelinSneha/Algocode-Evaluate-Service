import 'winston-mongodb';

import winston from 'winston';

import config from './serverConfig';

const allowedTransports = [];

// display logs in console
allowedTransports.push(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.printf((log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`),
    )
}));

// display error logs  in files
allowedTransports.push(new winston.transports.File({
    filename: `app.log`,
    level: "error"
}));

// display logs in mongogoDB Database
allowedTransports.push(new winston.transports.MongoDB({
    // only error logs are going to be stored in DB
    level: 'error',
    db: config.LOG_DB_URL || '',
    collection: 'logs',
}));

const logger = winston.createLogger({
    // default formatting to be displayed for the logger for all transports
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.printf((log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`),
    ),
    transports: allowedTransports
});

export default logger;