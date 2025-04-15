const express = require('express');
const logger = require("./lib/logger");
const { Router } = require("express");
const homePageController = require('./Controllers/homePageController');

function registerControllerRoutes(routes) {
  const controllerRouter = Router();

  routes.forEach((route) => {
    switch (route.method) {
      case "get":
        controllerRouter.get(route.path, route.handler);
        break;

      case "post":
        controllerRouter.post(route.path, route.handler);
        break;

      case "put":
        controllerRouter.put(route.path, route.handler);
        break;

      case "patch":
        controllerRouter.patch(route.path, route.handler);
        break;

      case "delete":
        controllerRouter.delete(route.path, route.handler);
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
        `/v1/${controller.basePath}`,
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
