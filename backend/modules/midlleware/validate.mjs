import { ValidationError } from "../errors/AppError.mjs";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
  };

if (error) {
  const details = error.details.map((d) => ({
    field: d.path.join("."),
    message: d.message,
  }));
  return next(new ValidationError("Validation Failed!", details));
}

req[source] = value;
next();
