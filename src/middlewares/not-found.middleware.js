const { sendError } = require("../utils/api-response");

function notFoundMiddleware(req, res) {
  return sendError(res, {
    status: 404,
    message: "Route not found",
    errors: [],
  });
}

module.exports = notFoundMiddleware;
