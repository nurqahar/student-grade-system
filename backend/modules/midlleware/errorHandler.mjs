import { handleDbError } from "../utils/handleDbError.mjs";
import { errorRespones } from "../utils/response.mjs";

export function errorHandler(error, req, res, next) {
  let appError = error;

  if (error.code && !error.isOperational) {
    appError = handleDbError(error, data);
  }

  if (!appError.isOperational) {
  }

  return errorRespones(res, {
    message: appError.message,
    data: data,
    statusCode: appError.statusCode || 500,
    errors: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}
