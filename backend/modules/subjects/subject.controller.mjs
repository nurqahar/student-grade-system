import Subject from "./subject.model.mjs";
import Classes from "../classes/class.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  try {
    const { subject_type, order, competency_achievement, class_id } = req.body;
    const newSubject = await Subject.create({
      subject_type,
      order,
      competency_achievement,
      class_id,
    });
    return successResponse(res, { data: newSubject, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  const dataCsv = req.body.data;

  let dataClasses;
  let dataLevels;
  let foundLevel;
  try {
    dataLevels = await Levels.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
  try {
    dataClasses = await Classes.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    foundLevel = dataLevels.find(
      (level) => level.level_name === row.level_name,
    );
  }

  for (const row of dataCsv) {
    const foundClass = dataClasses.find(
      (kelas) =>
        kelas.class_name === row.class_name && kelas.level_id === foundLevel.id,
    );

    if (!foundClass) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      subject_name: row.subject_name,
      subject_type: row.subject_type,
      order: row.order,
      competency_achievement: row.competency_achievement,
      class_id: foundClass.id,
    });

    if (dataToInsert.length === 0) {
      return errorResponse(res, {
        message: "Tidak ada data yang cocok dengan referensi di database",
        data: notFound,
        statusCode: 404,
      });
    }

    try {
      const inserted = await Subject.uploadCsv(dataToInsert);
      return successResponse(res, {
        data: inserted,
        statusCode: 201,
      });
    } catch (error) {
      return errorResponse(res, { errors: error });
    }
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Subject.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Subject.getById({ id });
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Subject.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await Subject.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Subject.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await Subject.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
