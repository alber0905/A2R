import winston, {format} from 'winston';

// File transport for both error and combined logs
const transports = [
  new winston.transports.File({ filename: 'log/error.log', level: 'error'}),
  new winston.transports.File({ filename: 'log/combined.log' }),
];

interface TransformableInfo {
  level: string;
  message: string;
}

// Function to remove the colors for the message
const removeColors = format((info: TransformableInfo): TransformableInfo => {
    // eslint-disable-next-line no-param-reassign
    info.message = info.message.replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    );

  return info;
});

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(removeColors(), format.json()),
  transports,
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;