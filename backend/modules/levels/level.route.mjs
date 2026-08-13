import express from "express";
import multer from "multer";
import {
  create,
  uploadCsv,
  getAll,
  getById,
  update,
  deleteData,
} from "./level.controller.mjs";
import { errorResponse } from "../utils/response.mjs";

const router = express.Router();
const storageBuffer = multer.memoryStorage();
const upload = multer({
  storage: storageBuffer,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" && !file.originalname.endsWith(".csv")) {
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
    return errorResponse(res, { message: error.message, statusCode: 400 });
  }
  if (error) {
    return errorResponse(res, { message: error.message, statusCode: 400 });
  }
  next();
});

export default router;
