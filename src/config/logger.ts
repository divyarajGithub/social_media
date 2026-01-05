import { createLogger, transports, format } from "winston";

const isProduction = process.env.NODE_ENV === "Production";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    format.splat(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      silent: isProduction,
      format: format.combine(format.colorize(), format.simple()),
    }),

    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new transports.File({
      filename: "logs/combined.log",
    }),
  ],
  exitOnError: false,
});
export default logger;
