import Absence from "./absence.model.mjs";
import Students from "../students/student.model.mjs";
import HistoryStudent from "../history_student/history.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  try {
    const newAbsence = await Absence.create(req.body);
    return successResponse(res, { data: newAbsence, statusCode: 201 })
  } catch (error) {
    return errorResponse(res, { errors: error })
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  const dataCsv = req.body.data;

  // ambil data referensi dari db untuk mencocokkan FK
  let dataStudents;
  let dataHistoryStudent;
  try {
    dataStudents = await Students.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error })
  }
  try {
    dataHistoryStudent = await HistoryStudent.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error })
  }

  // cocokkan tiap baris csv -> student_nis -> student_id -> history_id
  // (history_id dicari lewat kombinasi student_id, school_year, semester)
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
    return errorResponse(res, { message: "Tidak ada data yang cocok dengan referensi di database", data: notFound, statusCode: 404 })
  }

  try {
    const inserted = await Absence.uploadCsv(dataToInsert);
    return successResponse(res, { data: inserted, statusCode: 201 })
  } catch (error) {
    return errorResponse(res, { errors: error })
  }
};

export const viewDetail = async (req, res) => {
  const className = req.query.className;
  const levelName = req.query.levelName;
  const classLevel = { levelName: levelName, className: className };
  try {
    const dataJoined = await Absence.viewDetail(classLevel);
    return successResponse(res, { data: dataJoined })
  } catch (error) {
    return errorResponse(res, { message: 'Not Found!', statusCode: 404, errors: error })
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Absence.getAll();
    return successResponse(res, { data: data })
  } catch (error) {
    return errorResponse(res, { message: "Not Found!", statusCode: 404, errors: error })
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Absence.getById({ id });
    return successResponse(res, { data: data })
  } catch (error) {
    return errorResponse(res, { message: "id Not Found!", statusCode: 404, errors: error })
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Absence.getById(id);
  if (!dataId) return errorResponse(res, { message: "id Not Found!", data: null })

  try {
    const updated = await Absence.update(id, req.body);
    return successResponse(res, { data: updated })
  } catch (error) {
    return errorResponse(res, { message: "Not Found!", statusCode: 404, errors: error })
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Absence.getById(id);
  if (!dataId) return errorResponse(res, { message: "id Not Found!", data: null })

  try {
    const deleted = await Absence.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 })
  } catch (error) {
    return errorResponse(res, { message: "Not Found!", statusCode: 404, errors: error })
  }
};
