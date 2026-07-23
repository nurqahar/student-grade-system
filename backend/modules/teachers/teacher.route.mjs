import express from "express";
import {
  create,
  uploadCsv,
  getAll,
  getById,
  update,
  deleteData,
} from "./teacher.controller.mjs";

const router = express.Router();
router.post("/", create);
router.post("/uploadCsv", uploadCsv);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", deleteData);

export default router;
