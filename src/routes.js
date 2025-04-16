const express = require('express');
const logger = require("./lib/logger");
const { Router } = require("express");
const homePageController = require('./Controllers/homePageController');

function registerControllerRoutes(routes) {
  const controllerRouter = Router();

  routes.forEach((route) => {
    // Determine the handlers to use (middleware + handler or just handler)
    const handlers = route.middleware
      ? [route.middleware, route.handler]
      : [route.handler];

    switch (route.method) {
      case "get":
        controllerRouter.get(route.path, ...handlers);
        break;

      case "post":
        controllerRouter.post(route.path, ...handlers);
        break;

      case "put":
        controllerRouter.put(route.path, ...handlers);
        break;

      case "patch":
        controllerRouter.patch(route.path, ...handlers);
        break;

      case "delete":
        controllerRouter.delete(route.path, ...handlers);
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${route.method}`);
    }
  });

  return controllerRouter;
}

function registerUserRoute() {
  try {
    const router = Router();

    // Define an array of controller objects
    const controllers = [
      new homePageController()
    ];

    // Dynamically register routes for each controller
    controllers.forEach((controller) => {
      router.use(
        `/api/v1/${controller.basePath}`, // Use /api/v1 prefix
        registerControllerRoutes(controller.routes())
      );
    });

    return router;
  } catch (error) {
    logger.error("Unable to get user route", error);
    throw error;
  }
}

module.exports = {
  registerUserRoute
};
