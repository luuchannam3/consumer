import winston, { format } from 'winston';
import appRoot from 'app-root-path';

const { combine, timestamp, prettyPrint } = format;

export const logger = winston.createLogger({
  level: process.env.LOG_WINSTON || 'debug',
  format: combine(timestamp(), prettyPrint()),
  handleExceptions: true,
  json: false,
  colorize: false,
  transports: [
    new winston.transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/info.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/debug.log`,
      level: 'debug',
    }),
    new winston.transports.Console(),
  ],
  exitOnError: false,
});
