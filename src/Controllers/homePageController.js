const BaseController = require('../components/Basecontroller');
const { StatusCodes } = require('http-status-codes');
const logger = require('../lib/logger');


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
      },
      {
        path: '/decrypt-example',
        method: 'post',
        handler: this.decryptExample.bind(this)
      }
    ];
  }

  getHomePage(req, res) {
    try {
      // Set the data in res.locals.data for encryption
      res.locals.data = {
        message: 'Welcome to the Mathematics Learning Platform',
        status: 'success',
      };
      // Use the BaseController's send method to handle encryption
      this.send(res, StatusCodes.OK);
    } catch (error) {
      logger.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred',
        status: 'error'
      });
    }
  }

  /**
   * Example endpoint that demonstrates decryption of request data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  decryptExample(req, res) {
    try {
      // Decrypt the request data
      const decryptedData = this.decryptRequestData(req);

      // Log the decrypted data
      console.log('Decrypted data:', decryptedData);

      // Prepare response data
      res.locals.data = {
        message: 'Data successfully decrypted',
        status: 'success',
        receivedData: decryptedData
      };

      // Send encrypted response
      this.send(res, StatusCodes.OK);
    } catch (error) {
      logger.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while decrypting data',
        status: 'error'
      });
    }
  }
}

module.exports = HomePageController;