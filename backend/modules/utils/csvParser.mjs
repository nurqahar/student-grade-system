import parser from "csv-parser";
import { Readable } from "stream";

export const csvParser = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(filePath)
      .pipe(parser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
