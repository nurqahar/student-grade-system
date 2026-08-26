import { handleDbError } from "../utils/handleDbError.mjs";
import { errorResponse } from "../utils/response.mjs";

export function errorHandlerMiddleware(error, req, res, next) {
  let appError = error;

  if (error.code && !error.isOperational) {
    console.log(error)
    appError = handleDbError(error);
  }

  //if (!appError.isOperational) {
  //}

  return errorResponse(res, {
    message: appError.message,
    statusCode: appError.statusCode || 500,
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}
