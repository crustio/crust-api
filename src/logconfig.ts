const winston = require('winston');
 
// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/info.log'
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log'
        })
    ]
};

export = logConfiguration