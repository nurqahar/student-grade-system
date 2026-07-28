import HistoryStudent from "./history.model.mjs";
import Students from "../students/student.model.mjs";
import Classes from "../classes/class.model.mjs";
import Teachers from "../teachers/teacher.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  try {
    const newHistoryStudent = await HistoryStudent.create(req.body);
    return successResponse(res, { data: newHistoryStudent, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const viewDetail = async (req, res) => {
  try {
    const data = await HistoryStudent.viewDetail();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  const dataCsv = req.body.data;

  // ambil data referensi dari db untuk mencocokkan FK
  let dataStudents;
  let dataClasses;
  let dataTeachers;
  let dataLevels;
  let level;
  try {
    dataStudents = await Students.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
  try {
    dataClasses = await Classes.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
  try {
    dataLevels = await Levels.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
  try {
    dataTeachers = await Teachers.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }

  for (const row of dataCsv) {
    level = dataLevels.find((level) => level.level_name === row.level_name);
  }

  // cocokkan tiap baris csv dengan students, classes, teachers
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

  if (dataToInsert.length === 0) {
    return errorResponse(res, {
      message: "Tidak ada data yang cocok dengan referensi di database",
      data: notFound,
      statusCode: 404,
    });
  }

  try {
    const inserted = await HistoryStudent.uploadCsv(dataToInsert);
    return successResponse(res, {
      data: { inserted, notFound },
      statusCode: 201,
    });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await HistoryStudent.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await HistoryStudent.getById({ id });
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = HistoryStudent.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await HistoryStudent.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = HistoryStudent.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await HistoryStudent.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
