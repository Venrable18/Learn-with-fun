const util = require('util');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../abstraction/ApiError');
const logger = require('../lib/logger');


// Error handler middleware
const addErrorHandler = (err, req, res, next) => {
  if (err) {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    
    // Log detailed error information
    logger.debug(`REQUEST HANDLING ERROR:
      \nERROR:\n${JSON.stringify(err)}
      \nREQUEST HEADERS:\n${util.inspect(req.headers)}
      \nREQUEST PARAMS:\n${util.inspect(req.params)}
      \nREQUEST QUERY:\n${util.inspect(req.query)}
      \nBODY:\n${util.inspect(req.body)}`);

    // Create error response
    const body = {
      fields: err.fields,
      message: err.message || 'An error occurred during the request.',
      name: err.name,
      status,
      success: false
    };

    res.status(status).json(body);
  }
  next();
};

module.exports = addErrorHandler;
