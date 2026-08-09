import express from "express";
import absenceRoute from "./absence/absence.route.mjs";
import assessmentRoute from "./assessment/assessment.route.mjs";
import classRoute from "./classes/class.route.mjs";
import historyStudentRoute from "./history_student/history.route.mjs";
import levelRoute from "./levels/level.route.mjs";
import studentRoute from "./students/student.route.mjs";
import subjectRoute from "./subjects/subject.route.mjs";
import teacherRoute from "./teachers/teacher.route.mjs";
import raporRoute from "./rapor/rapor.route.mjs";

const router = express.Router();

router.use("/absence", absenceRoute);
router.use("/assessment", assessmentRoute);
router.use("/classes", classRoute);
router.use("/history_student", historyStudentRoute);
router.use("/levels", levelRoute);
router.use("/students", studentRoute);
router.use("/subjects", subjectRoute);
router.use("/teachers", teacherRoute);
router.use("/rapor", raporRoute);

export default router;
