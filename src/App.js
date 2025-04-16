const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const httpStatus = require("http-status-codes");
const http = require("http");
const swaggerDocument = require("./utils/swagger");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const logger = require("./lib/logger");
const addErrorHandler = require("./middleware/error-handler");
const { registerUserRoute } = require('./routes');

dotenv.config();

class App {
  constructor() {
    this.express = express();
    this.httpServer = http.createServer(this.express);
  }

  async init() {
    const { NODE_ENV } = process.env;

    // Add all global middleware like cors
    this.middleware();

    // Register all routes
    this.routes();

    // Add the middleware to handle error, make sure to add it after registering routes
    this.express.use(addErrorHandler);

    // In a development/test environment, Swagger will be enabled
    if (NODE_ENV && NODE_ENV !== 'prod') {
      this.setupSwaggerDocs();
    }
  }

  routes() {
    // Base routes
    this.express.get("/", this.basePathRoute);
    this.express.get("/web", this.parseRequestHeader, this.basePathRoute);

    // Use the router from routes.js
    this.express.use(registerUserRoute());
  }

  middleware() {
    // Security and parsing middleware
    this.express.use(helmet({ contentSecurityPolicy: false }));
    this.express.use(express.json({ limit: "100mb" }));
    this.express.use(express.urlencoded({ limit: "100mb", extended: true }));

    // CORS configuration
    const corsOptions = {
      origin: [
        "http://localhost:8080/",
        "http://example.com/",
        "http://127.0.0.1:8080",
      ],
    };
    this.express.use(cors(corsOptions));
  }

  basePathRoute(req, res) {
    const domain = `${req.protocol}://${req.get('host')}`;
    res.json({
      message: 'Welcome to the Mathematics Learning Platform',
      status: 'success',
      links: {
        documentation: `${domain}/docs`,
        api: `${domain}/api/v1`,
        home: `${domain}/api/v1/home`
      }
    });
  }

  parseRequestHeader(req, res, next) {
    // Parse request header
    const xInternalAuthorization = req.headers['x-internal-authorization'];
    const authorization = req.headers['authorization'];

    if (!xInternalAuthorization) {
      const error = {
        status: httpStatus.StatusCodes.UNAUTHORIZED,
        name: 'Internal Token Missing',
        message: 'Internal authorization token is required'
      };
      return next(error);
    } else if (!authorization) {
      const error = {
        status: httpStatus.StatusCodes.UNAUTHORIZED,
        name: 'External Token Missing',
        message: 'Authorization token is required'
      };
      return next(error);
    } else {
      next();
    }
  }

  setupSwaggerDocs() {
    // Swagger documentation
    this.express.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Swagger JSON endpoint
    this.express.get("/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerDocument);
    });

    logger.info(`Swagger is running on http://localhost:8080/docs`);
  }
}

module.exports = App;

