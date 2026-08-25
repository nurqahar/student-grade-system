import { handleDbError } from "../utils/handleDbError.mjs";
import { errorResponse } from "../utils/response.mjs";

export function errorHandler(error, req, res, next) {
  let appError = error;

  if (error.code && !error.isOperational) {
    appError = handleDbError(error, data);
  }

  if (!appError.isOperational) {
  }

  return errorResponse(res, {
    message: appError.message,
    data: data,
    statusCode: appError.statusCode || 500,
    errors: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}
