const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const httpStatus = require("http-status-codes");
const http = require("http");
const swaggerSpec = require("./utils/swagger");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const logger = require("./lib/logger");
const addErrorHandler = require("./middleware/error-handler");
const {registerUserRoute} = require('./routes')



dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.middleware();
    this.routes();
    this.start();
  }

  start() {
    const{NODE_ENV} = process.env;
  if (NODE_ENV && NODE_ENV !== 'production') {  
    this.setupSwaggerDocs();
  }

  }

  routes() {
    this.app.get("/", this.basePathRoute);
    this.app.get("/web", this.parseRequestHeader, this.basePathRoute);
    this.app.use('/', registerUserRoute());
  }

 
  middleware() {
    // Security and parsing middleware
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(express.urlencoded({ limit: "100mb", extended: true }));
    this.app.use(addErrorHandler);
    
    
    // CORS configuration
    const corsOptions = {
      origin: ["http://localhost:8080"],
    };
    this.app.use(cors(corsOptions));
  };

  basePathRoute(request, response) {
    response.json({ message: 'base path' });
  }

  parseRequestHeader(request, response, next) {
    // Parse request header logic here
    next();
  };

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

