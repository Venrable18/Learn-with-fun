const express = require('express');
const logger = require("./lib/logger");
const { Router } = require("express");
const userController = require('./Controllers/userController');

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
    const userControllers = [new userController()];

    // Dynamically register routes for each controller
    userControllers.forEach((userController) => {
      // Make sure each controller has basePath attribute and routes() method
      router.use(
        `/v1/${userController.basePath}`,
        registerControllerRoutes(userController.routes())
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
