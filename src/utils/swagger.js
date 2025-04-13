const swaggerJsDocs = require("swagger-jsdoc");
const { version } = require("../../package-lock.json");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mathematics Learning Platform",
      version,
      contact: {
        name: "Venrable18",
        url: "https://learn-with-fun.com",
        email: "onenvictor@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/", // This is your base URL
      },
    ],
    securitySchemas: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/components/system-status/SystemStatusController.ts"
  ],
};

// Initialize your swagger docs;

const swaggerSpec = swaggerJsDocs(swaggerOptions);

module.exports = swaggerSpec;
