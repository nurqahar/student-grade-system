import { handleDbError } from "../utils/handleDbError.mjs";
import { errorResponse } from "../utils/response.mjs";

export function errorHandlerMiddleware(error, req, res, next) {
  let appError = error;

  if (error.code && !error.isOperational) {
    appError = handleDbError(error);
  }

  if (!appError.isOperational) {
    console.error("Unexpected Error: ", error);
  }

  return errorResponse(res, {
    message: appError.message,
    statusCode: appError.statusCode || 500,
    errors: process.env.NODE_ENV === "development" ? error.stack : undefined,
    data: appError.data,
  });
}
