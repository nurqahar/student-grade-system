export class AppError extends Error {
  constructor(message, data, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    ((this.data = data), (this.details = details));
  }
}

export class ValidationError extends AppError {
  constructor(message, data, details = null) {
    super(message, data, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} Not Found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}
