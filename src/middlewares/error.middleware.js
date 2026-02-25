const { sendError } = require("../utils/api-response");
const { AppError } = require("../utils/errors");

function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return sendError(res, {
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);
  return sendError(res, {
    status: 500,
    message: "Unexpected server error",
    errors: [],
  });
}

module.exports = errorMiddleware;
