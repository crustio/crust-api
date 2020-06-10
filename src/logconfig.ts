const winston = require('winston');
 
// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log'
        })
    ]
};

export = logConfiguration