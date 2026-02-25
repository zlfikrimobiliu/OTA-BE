const { sendError } = require("../utils/api-response");

function zodIssuesToErrors(issues) {
  return issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}

function validate(schema, source = "body") {
  return (req, res, next) => {
    const payload = req[source];
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return sendError(res, {
        status: 422,
        message: "Validation error",
        errors: zodIssuesToErrors(parsed.error.issues),
      });
    }

    req[source] = parsed.data;
    return next();
  };
}

module.exports = validate;
