import Classes from "./class.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newClasses = await Classes.create(req.body);
  return successResponse(res, { data: newClasses, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  const dataCsv = req.body.data;

  let dataLevels;
  try {
    dataLevels = await Levels.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundLevel = dataLevels.find(
      (level) => level.level_name === row.level_name,
    );

    if (!foundLevel) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      level_id: foundLevel.id,
      class_name: row.class_name,
    });
  }

  if (dataToInsert.length === 0) {
    return errorResponse(res, {
      message: "Tidak ada data yang cocok dengan referensi di database",
      data: notFound,
      statusCode: 404,
    });
  }

  const inserted = await Classes.uploadCsv(dataToInsert);
  return successResponse(res, { data: inserted, statusCode: 201 });
});

export const viewDetail = async (req, res) => {
  const data = await Classes.viewDetail();
  return successResponse(res, { data: data });
};

export const getAll = async (req, res) => {
  const data = await Classes.getAll();
  return successResponse(res, { data: data });
};

export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  const data = await Classes.getById(id);

  if (!data) {
    return errorResponse(res, {
      message: "Data not found!",
      statusCode: 404,
    });
  }

  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  const dataId = Classes.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  const updated = await Classes.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  const dataId = await Classes.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  const deleted = await Classes.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
