const fs = require("fs");
const path = require("path");
const winston = require("winston");

// Correct the log directory path to explicitly use the root of your project
const logDir = path.resolve(process.cwd(), "log"); // process.cwd() points to the root of the project

// Ensure the log directory exists
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`Log directory created at ${logDir}`);
  } 
} catch (err) {
  console.error(
    `Failed to create log directory: ${err instanceof Error ? err.message : "Unknown error"}`,
  );
  throw err; // Rethrow the error if directory creation fails
}

// Create and export the logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }), // Log file in 'log' folder at the root
  ],
});

module.exports = logger;
