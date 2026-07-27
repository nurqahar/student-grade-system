import express from "express";
import {
  create,
  getAll,
  uploadCsv,
  viewDetail,
  getById,
  update,
  deleteData,
} from "./achievement.controller.mjs";

const router = express.Router();
router.post("/", create);
router.post("/uploadCsv", uploadCsv);
router.get("/", getAll);
router.get("/viewDetail", viewDetail);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", deleteData);

export default router;
