const StatusCodes = require("http-status-codes");

class ApiError extends Error {
  constructor(msg, statusCode, name = "ApiError") {
    super();
    this.status = statusCode;
    this.name = name;
    this.success = false;
    
    // Initialize fields
    this.fields = {
      name: {
        message: msg,
      },
    };

    // Maintain proper stack trace (only in V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

module.exports = ApiError;
