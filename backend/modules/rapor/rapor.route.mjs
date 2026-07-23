import express from "express";
import { printZip, printCombined, printStudent } from "./rapor.controller.mjs";

const router = express.Router();

router.post("/printZip", printZip);
router.post("/printCombined", printCombined);
router.get("/printStudent/:historyId", printStudent);

export default router;
