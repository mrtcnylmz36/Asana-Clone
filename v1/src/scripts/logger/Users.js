const winston = require('winston');

const userLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'v1/src/logs/users/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'v1/src/logs/users/info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'v1/src/logs/users/combined.log',
    }),
    // new winston.transports.Console(),
  ],
});

module.exports = userLogger;
