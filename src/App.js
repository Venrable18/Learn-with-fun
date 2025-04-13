const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const httpStatus = require("http-status-codes");
const http = require("http");
const swaggerSpec = require("./utils/swagger");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const logger = require("./lib/logger");


dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
  }

  start() {
    this.middleware();
    this.routes();
    this.setupSwaggerDocs();
    return this;
  }

  routes() {
    this.app.get("/", this.basePathRoute);
  }

  middleware() {
    // Security and parsing middleware
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(express.urlencoded({ limit: "100mb", extended: true }));

    // CORS configuration
    const corsOptions = {
      origin: ["http://localhost:8080"],
    };
    this.app.use(cors(corsOptions));
  }

  basePathRoute(request, response) {
    response.json({ message: 'base path' });
  }

  parseRequestHeader(request, response, next) {
    // Parse request header logic here
    next();
  }

  setupSwaggerDocs() {
    // Swagger documentation
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger JSON endpoint
    this.app.get("/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    logger.info(`Swagger is running on http://localhost:5000/docs`);
  }
}

module.exports = App;

