// const {request, response, next } = require('express');
// const ApiError = require('./abstraction/ApiError');


// const homePage = ( Request, response, NextFunction) => {
//     try {
//       res.status(200).json('This is the home page');
//     } catch (error) {
//       logger.error(error); // Log the error
//       next(new ApiError("ApiError", StatusCodes.BAD_GATEWAY)); // Pass the error to the next middleware
//     }
//   };
  
//   module.export = homePage;