const logger = require("./lib/logger");
const { Router } = require("express");

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

module.exports = {
  registerControllerRoutes
};
