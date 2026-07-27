import express from "express";
import {
  create,
  uploadCsv,
  getAll,
  viewDetail,
  getAllJoined,
  getById,
  getByIdJoined,
  update,
  deleteData,
} from "./assessment.controller.mjs";

const router = express.Router();
router.post("/", create);
router.post("/uploadCsv", uploadCsv);
router.get("/", getAll);
router.get("/viewDetail", viewDetail);
router.get("/getAllJoined", getAllJoined);
router.get("/:id", getById);
router.get("/getByIdJoined/:id", getByIdJoined);
router.put("/:id", update);
router.delete("/:id", deleteData);

export default router;
