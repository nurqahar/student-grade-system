import Achievement from "./achievement.model.mjs";
import Subjects from "../subjects/subject.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  try {
    const newAchievement = await Achievement.create(req.body);
    return successResponse(res, { data: newAchievement, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  const dataCsv = req.body.data;

  // ambil data subjects dari db untuk mencocokkan subject_name -> subject_id
  let dataSubjects;
  try {
    dataSubjects = await Subjects.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }

  // cocokkan tiap baris csv dengan subjects, lalu bentuk data siap insert
  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundSubject = dataSubjects.find(
      (subject) => subject.subject_name === row.subject_name,
    );

    if (!foundSubject) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      subject_id: foundSubject.id,
      competency_achievement: row.competency_achievement,
      school_year: row.school_year,
      semester: parseInt(row.semester, 10),
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
    const inserted = await Achievement.uploadCsv(dataToInsert);
    return successResponse(res, { data: inserted, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const viewDetail = async (req, res) => {
  const className = req.query.className;
  try {
    const data = await Achievement.viewDetail(className);
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getAllJoined = async (req, res) => {
  try {
    const dataJoined = await Achievement.getAllJoined();
    return successResponse(res, { data: dataJoined });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Achievement.getAll();
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
    const data = await Achievement.getById(id);

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

  const dataId = Achievement.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await Achievement.update(id, req.body);
    return res.status(200).json(updated);
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

  const dataId = Achievement.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await Achievement.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
