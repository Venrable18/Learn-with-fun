const { StatusCodes } = require("http-status-codes");
const { getEncryptedText, decodeEncryptedText } = require("../utils/index");

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

  /**
   * Decrypts the request data
   * @param {Object} req - Express request object
   * @returns {Object} - The decrypted data
   */
  decryptRequestData(req) {
    try {
      // Check if there's encrypted data in the request body
      if (req.body && req.body.data) {
        // Decrypt the data
        const decryptedData = decodeEncryptedText(req.body.data);
        // Replace the encrypted data with the decrypted data
        req.body = decryptedData;
      }
      return req.body;
    } catch (error) {
      console.error('Error decrypting request data:', error.message);
      // Return the original body if decryption fails
      return req.body;
    }
  }
}

module.exports = BaseController;




