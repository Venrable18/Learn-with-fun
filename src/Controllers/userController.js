const BaseController = require('../components/Basecontroller');
const { StatusCodes } = require('http-status-codes');

class UserController extends BaseController {
  constructor() {
    super();
        // base path
        this.basePath = "Users";
  }

  routes() {
    return [
      {
        path: '/getUser',
        method: 'get',
        handler: this.getUser.bind(this)
      }
    ];
  }

  getUser(req, res, next) {
    try {

      // simulate fetching data from a database
      const userData = {
        username: "John Doe",
        email: "johndoe@gmail.com",
        address: "123 Main Street"
      };

      //Attach the data to res.locals

      res.locals.data = userData;

      // send encrypted response using BaseController's send method;

      super.send(res, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }

  
}

module.exports = UserController;
