const BaseController = require('../components/Basecontroller');
const { StatusCodes } = require('http-status-codes');

class HomePageController extends BaseController {
  constructor() {
    super();
    this.basePath = "home"; // Base path for routes
  }

  routes() {
    return [
      {
        path: '/',
        method: 'get',
        handler: this.getHomePage.bind(this)
      }
    ];
  }

  getHomePage(req, res, next) {
    try {
      const homePageData = {
        message: 'Welcome to the Home Page!',
        version: '1.0.0',
        description: 'This is the homepage of the application.'
      };

      // Attach data to res.locals
      res.locals.data = homePageData;

      // Send response using BaseController's send method
      super.send(res, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HomePageController;