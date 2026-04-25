export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);

  let statusCode = err.statusCode || res.statusCode || 500;

  // MongoDB Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid ID format";
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    err.message = "Duplicate field value";
  }

  // Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    err.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};