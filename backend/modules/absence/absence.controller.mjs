import Absence from "./absence.model.mjs";
import Students from "../students/student.model.mjs";
import HistoryStudent from "../history_student/history.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { AppError, ValidationError } from "../errors/AppError.mjs";

export const create = async (req, res) => {
  try {
    const newAbsence = await Absence.create(req.body);
    return successResponse(res, { data: newAbsence, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    throw new ValidationError("Empty Data!");
  }

  const dataCsv = req.body.data;

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

  try {
    const inserted = await Absence.uploadCsv(dataToInsert);
    return successResponse(res, { data: inserted, statusCode: 201 });
  } catch (error) {
    throw new AppError("Failed to upload CSV", 500)
  }
});

export const getAll = async (req, res) => {
  try {
    const data = await Absence.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  try {
    const data = await Absence.getById(id);

    if (!data) {
      return errorResponse(res, {
        message: "Data not found!",
        statusCode: 404,
      });
    }

    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  const dataId = Absence.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await Absence.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  const dataId = await Absence.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await Absence.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
