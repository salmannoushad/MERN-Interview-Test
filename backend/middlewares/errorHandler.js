// middlewares/errorHandler.js
const statusCodes = require('../utils/statusCodes');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Stack trace only in development
  };
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
