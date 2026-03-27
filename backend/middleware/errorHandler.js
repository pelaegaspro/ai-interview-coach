const multer = require("multer");
const { AppError } = require("../../utils/errors");

function notFoundHandler(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      error: "upload_error",
      message: error.message
    });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError
      ? error.message
      : "Something went wrong while processing the request.";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: error.name || "application_error",
    message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
