const http = require("http");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const App = require("./App");
const logger = require("./lib/logger");

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
        await app.start();
        const PORT = process.env.PORT || 5000;
        app.app.set('port', PORT);

        server.on('error', serverError);
        server.on('listening', serverListening);
        server.on('error', (error) => {
            if (error.syscall !== 'listen') throw error;
            switch (error.code) {
                case 'EACCES':
                    logger.error(`Port ${PORT} requires elevated privileges`);
                    process.exit(1);
                case 'EADDRINUSE':
                    logger.error(`Port ${PORT} is already in use`);
                    process.exit(1);
                default:
                    throw error;
            }
        });
        
        server.listen(PORT);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions and promise rejections
process.on('unhandledRejection', (reason) => {
    if (reason instanceof Error) {
        logger.error('Unhandled Promise Rejection:', reason.message);
        logger.error(reason.stack);
    }
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.message);
    logger.error(error.stack);
    server.close(() => process.exit(1));
});

startServer();