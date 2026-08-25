import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../errors/AppError.mjs";

export function handleDbError(error, data) {
  switch (error.code) {
    case "42703": //undefined column
      return new ValidationError("Undefined Column in the Data", data);
    case "23505": // unique violation
      return new ConflictError("Duplicate Data", data);
    case "23502": // not null violation
      return new ValidationError(
        `Column "${error.column}" Cannot be Empty!`,
        data,
      );
    case "23503": // foreign key violation
      return new ValidationError(
        "Header Name doesn\'t exist in server, please consider to change it!",
        data,
      );
    case "22P02": // invalid text representation (tipe data salah)
      return new ValidationError("Wrong Data Type!", data);
    default:
      return new AppError("Server Error", data);
  }
}
