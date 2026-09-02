export class AppError extends Error {
  constructor(message, statusCode = 500, data = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.data = data;
    this.isOperational = true;
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null, data = null) {
    super(message, 400, details, data);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource", data = null) {
    super(`${resource} Not Found`, 404, data);
  }
}

export class ConflictError extends AppError {
  constructor(message, data = null) {
    super(message, 409, data);
  }
}
