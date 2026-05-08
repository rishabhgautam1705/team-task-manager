export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || "Validation failed");
    error.statusCode = 400;
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  req.validated = result.data;
  next();
};
