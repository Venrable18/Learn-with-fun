const http = require("http");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const App = require("./App");
const logger = require("./lib/logger");
const ApiError = require('./abstraction/ApiError');

// Initialize app and environment
const app = new App();

dotenv.config();

const server = http.createServer(app);

function serverError(err) {
    if (err.syscall !== "listen") {
        logger.error("Unexpected error during server startup", err);
      throw err;
    }
    throw new ApiError("Syscall error", StatusCodes.CONFLICT);
}
  

function serverListening() {
    const address = server.address();
    logger.info(`Server listening on http://localhost:${address.port}`);
}

async function startServer() {
    try {
        const PORT = process.env.PORT || 5000;
        app.app.set('port', PORT);
        server.on('error', serverError);
        server.on('listening', serverListening);
        server.listen(PORT, () => {
            logger.info(`Server running on ${PORT}`);
        });
    } catch (err) {
        if (err instanceof Error) {
          logger.error(err.name);
          logger.error(err.message);
          logger.error(err.stack);
        }
        process.exit(1);
    }
    
    // Handle uncaught exceptions and promise rejections
    process.on('unhandledRejection', (reason) => {
    if (reason instanceof Error) {
        logger.error('Unhandled Promise Rejection:', reason.message);
        logger.error(reason.stack);
    }
    if (server && server.listening) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.message);
    logger.error(error.stack);
    if (server && server.listening) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

};
startServer();