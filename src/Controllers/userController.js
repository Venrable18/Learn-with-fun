    
    const BaseController = require('./BaseController');
    const { Request, Response } = require('express');
    const { StatusCodes } = require('http-status-codes');

    class UserController extends BaseController {
      routes() {
        return [
          {
            path: '/users',
            method: 'get',
            handler: this.getUsers
          }
        ];
      }

      async getUsers(Request, Response) {
        const users = await UserService.getAllUsers();
        res.locals.data = users; // Set data to be encrypted
        this.send(res); // Use inherited send method
      }
    }
