import express from "express";
import multer from "multer";
import { ValidationError } from "../errors/AppError.mjs";
import {
  create,
  uploadCsv,
  getAll,
  getById,
  update,
  deleteData,
} from "./absence.controller.mjs";

const router = express.Router();
const upload = multer({
  storage: storageBuffer,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" || !file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files are allowed!"));
    }
    cb(null, true);
  },
  limits: { fieldSize: 1024 },
});

router.post("/", create);
router.post("/uploadCsv", upload.single("file"), uploadCsv);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", deleteData);
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    throw new ValidationError(error.message)
  }
  if (error) {
    throw new ValidationError(error.message)
  }
  next();
});

export default router;
