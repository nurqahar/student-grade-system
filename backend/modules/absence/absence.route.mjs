import express from "express";
import {
  create,
  uploadCsv,
  viewDetail,
  getAll,
  getById,
  update,
  deleteData,
} from "./absence.controller.mjs";

const router = express.Router();
router.post("/", create);
router.post("/uploadCsv", uploadCsv);
router.get("/", getAll);
router.get("/viewDetail", viewDetail);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", deleteData);

export default router;
