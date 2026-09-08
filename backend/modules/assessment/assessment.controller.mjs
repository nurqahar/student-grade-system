import Assessment from "./assessment.model.mjs";
import HistoryStudent from "../history_student/history.model.mjs";
import Subjects from "../subjects/subject.model.mjs";
import Students from "../students/student.model.mjs";
import Classes from "../classes/class.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newAssessment = await Assessment.create(req.body);
  return successResponse(res, { data: newAssessment, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0)
    throw new ValidationError("Empty Data!");

  const dataCsv = req.body.data;

  // ambil semua data referensi dari db untuk mencocokkan FK
  let dataStudents;
  let dataClasses;
  let dataSubjects;
  let dataHistoryStudent;

  dataStudents = await Students.getAll();
  dataClasses = await Classes.getAll();
  dataSubjects = await Subjects.getAll();
  dataHistoryStudent = await HistoryStudent.getAll();

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    // 1. cari student lewat student_nis
    const foundStudent = dataStudents.find(
      (student) =>
        parseInt(student.student_nis, 10) === parseInt(row.student_nis, 10),
    );

    // 3. cari class lewat class_name (+ level_id kalau level ketemu, biar tidak salah kelas)
    const foundClass = dataClasses.find(
      (kelas) =>
        kelas.class_name === row.class_name && kelas.level_id === row.level_id,
    );

    // 4. cari history_student lewat student_id + school_year + semester
    //    (divalidasi silang dengan class_id kalau class ketemu)
    const foundHistory = dataHistoryStudent.find(
      (history) =>
        foundStudent &&
        history.student_id === foundStudent.id &&
        history.school_year === row.school_year &&
        parseInt(history.semester, 10) === parseInt(row.semester, 10) &&
        (!foundClass || history.class_id === foundClass.id),
    );

    // 5. cari subject lewat subject_name
    const foundSubject = dataSubjects.find(
      (subject) => subject.subject_name === row.subject_name,
    );

    if (!foundHistory || !foundSubject) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      history_id: foundHistory.id,
      subject_id: foundSubject.id,
      numeric_grade: parseInt(row.numeric_grade, 10),
      letter_grade: row.letter_grade || null,
      grade_type: row.grade_type,
    });
  }

  if (dataToInsert.length === 0)
    throw new ValidationError("Unmatch with reference in table");
  const inserted = await Assessment.uploadCsv(dataToInsert);
  return successResponse(res, { data: inserted, statusCode: 201 });
});

export const viewDetail = asyncHandler(async (req, res) => {
  const className = req.query.className;
  const levelName = req.query.levelName;
  const classLevel = { levelName: levelName, className: className };
  const data = await Assessment.viewDetail(classLevel);
  return successResponse(res, { data: data });
});

export const getAllJoined = asyncHandler(async (req, res) => {
  const dataJoined = await Assessment.getAllJoined();
  return successResponse(res, { data: dataJoined });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Assessment.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) throw new NotFoundError("ID Not Found!");
  const data = await Assessment.getById(id);
  return successResponse(res, { data: data });
});

export const getByIdJoined = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  const data = await Assessment.getByIdJoined(id);
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = await Assessment.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const updated = await Assessment.update(id, req.body);
  return res.status(200).json(updated);
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Assessment.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const deleted = await Assessment.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
