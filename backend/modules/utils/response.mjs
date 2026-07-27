export function successResponse(res, { data, statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}
export function errorResponse(
  res,
  {
    message = "Internal Server Error",
    data,
    statusCode = 500,
    errors = null,
  } = {},
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      data,
      details: errors,
    },
    timestamp: new Date().toISOString(),
  });
}
