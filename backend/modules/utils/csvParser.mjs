import parser from "csv-parser";
import { Readable } from "stream";
import { ValidationError } from "../errors/AppError.mjs";

export const csvParser = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(fileBuffer)
      .pipe(parser({ separator: ";" }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(new ValidationError(error)));
  });
};
