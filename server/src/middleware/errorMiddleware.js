export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;

  // eslint-disable-next-line no-console
  console.error("[API Error]", {
    statusCode,
    message: error.message,
    path: req?.originalUrl,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    name: error?.name,
    code: error?.code,
  });

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};


