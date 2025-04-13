const { StatusCodes } = require("http-status-codes");
const getEncryptedText = require("../utils/index");

/**
 * Base controller
 */
class BaseController {
  // Abstract method - must be implemented by child classes
  routes() {
    throw new Error("Method 'routes()' must be implemented.");
  }

  // Global method to send API responses
  // Encrypt the response data
  send(res, StatusCode = StatusCodes.OK) {
    try {
      const encryptedData = getEncryptedText(res.locals.data);
      res.status(StatusCode).send({ data: encryptedData });
    } catch (error) {
      // For case of error send an internal server error
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error encrypting data", error });
    }
  }
}

module.exports = BaseController;



    // import BaseController from './BaseController';
    // import { Request, Response } from 'express';
    // import { StatusCodes } from 'http-status-codes';

    // class UserController extends BaseController {
    //   routes() {
    //     return [
    //       {
    //         path: '/users',
    //         method: 'get',
    //         handler: this.getUsers
    //       }
    //     ];
    //   }

    //   async getUsers(req: Request, res: Response) {
    //     const users = await UserService.getAllUsers();
    //     res.locals.data = users; // Set data to be encrypted
    //     this.send(res); // Use inherited send method
    //   }
    // }

