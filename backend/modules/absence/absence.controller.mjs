import Absence from "./absence.model.mjs";
import Students from "../students/student.model.mjs";
import HistoryStudent from "../history_student/history.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { csvParser } from "../utils/csvParser.mjs";

export const create = asyncHandler(async (req, res) => {
  const newAbsence = await Absence.create(req.body);
  return successResponse(res, { data: newAbsence, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.file) throw new ValidationError("Empty Data!");

  const dataCsv = await csvParser(req.file.buffer);
  if (!dataCsv || dataCsv.length === 0) throw new ValidationError("CSV File empty or has no data rows!");

  let dataStudents;
  let dataHistoryStudent;
  dataStudents = await Students.getAll();
  dataHistoryStudent = await HistoryStudent.getAll();

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundStudent = dataStudents.find(
      (student) =>
        parseInt(student.student_nis, 10) === parseInt(row.student_nis, 10),
    );

    if (!foundStudent) {
      notFound.push(row);
      continue;
    }

    const foundHistory = dataHistoryStudent.find(
      (history) =>
        history.student_id === foundStudent.id &&
        history.school_year === row.school_year &&
        parseInt(history.semester, 10) === parseInt(row.semester, 10),
    );

    if (!foundHistory) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      history_id: foundHistory.id,
      sakit: row.sakit,
      izin: row.izin,
      alpa: row.alpa,
    });
  }

  if (dataToInsert.length === 0) {
    throw new ValidationError(`Data not Match with database ${notFound}`);
  }

  const inserted = await Absence.uploadCsv(dataToInsert);
  return successResponse(res, { data: inserted, statusCode: 201 });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Absence.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  const data = await Absence.getById(id);
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Absence.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const updated = await Absence.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = await Absence.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const deleted = await Absence.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
