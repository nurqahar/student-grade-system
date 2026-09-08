import HistoryStudent from "./history.model.mjs";
import Students from "../students/student.model.mjs";
import Classes from "../classes/class.model.mjs";
import Teachers from "../teachers/teacher.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newHistoryStudent = await HistoryStudent.create(req.body);
  return successResponse(res, { data: newHistoryStudent, statusCode: 201 });
});

export const viewDetail = asyncHandler(async (req, res) => {
  const data = await HistoryStudent.viewDetail();
  return successResponse(res, { data: data });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0)
    throw new ValidationError("Empty Data!");

  const dataCsv = req.body.data;

  let dataStudents;
  let dataClasses;
  let dataTeachers;
  let dataLevels;
  let level;
  dataStudents = await Students.getAll();
  dataClasses = await Classes.getAll();
  dataLevels = await Levels.getAll();
  dataTeachers = await Teachers.getAll();

  for (const row of dataCsv) {
    level = dataLevels.find((level) => level.level_name === row.level_name);
  }

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundStudent = dataStudents.find(
      (student) =>
        parseInt(student.student_nis, 10) === parseInt(row.student_nis, 10),
    );
    const foundClass = dataClasses.find(
      (kelas) =>
        kelas.class_name === row.class_name && kelas.level_id === level.id,
    );
    const foundTeacher = dataTeachers.find(
      (teacher) =>
        teacher.teacher_registration_number ===
        parseInt(row.teacher_registration_number, 10),
    );

    if (!foundStudent || !foundClass || !foundTeacher) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      student_id: foundStudent.id,
      class_id: foundClass.id,
      class_advisor_id: foundTeacher.id,
      school_year: row.school_year,
      semester: parseInt(row.semester, 10),
      class_advisor_note: row.class_advisor_note || "-",
      status: row.status,
    });
  }


  if (dataToInsert.length === 0)
    throw new ValidationError("Unmatch with reference in table");

  const inserted = await HistoryStudent.uploadCsv(dataToInsert);
  return successResponse(res, {
    data: inserted,
    statusCode: 201,
  });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await HistoryStudent.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  const data = await HistoryStudent.getById({ id });
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = HistoryStudent.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const updated = await HistoryStudent.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = HistoryStudent.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const deleted = await HistoryStudent.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
