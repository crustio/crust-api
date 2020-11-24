import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.colorize(),
    format.errors({stack: true}),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `crust-api-combined.log`.
    // - Write all logs error (and below) to `crust-api-error.log`.
    //
    new transports.Console(),
    new transports.File({filename: 'crust-api-error.log', level: 'error'}),
    new transports.File({filename: 'crust-api-combined.log'}),
  ],
});
