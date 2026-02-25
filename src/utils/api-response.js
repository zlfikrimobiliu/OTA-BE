function sendSuccess(res, { status = 200, message = "OK", data = {} } = {}) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function sendError(
  res,
  { status = 500, message = "Internal server error", errors = [] } = {},
) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  sendSuccess,
  sendError,
};

