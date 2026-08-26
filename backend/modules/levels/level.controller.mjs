import Level from "./level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { csvParser } from "../utils/csvParser.mjs";
import { AppError, ValidationError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = async (req, res) => {
  try {
    const newLevel = await Level.create(req.body);
    return successResponse(res, { data: newLevel, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError("Empty Data!")
  }

  const csvFile = await csvParser(req.file.buffer);
  if (!csvFile || csvFile.length === 0) {
    throw new ValidationError("CSV File empy or has no data rows!")
  }

  try {
    const newLevel = await Level.uploadCsv(csvFile);
    return successResponse(res, { data: newLevel, statusCode: 201 });
  } catch (error) {
    throw new AppError("failed to upload CSV", 500)
  }
});

export const getAll = async (req, res) => {
  try {
    const data = await Level.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Level.getById({ id });
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Level.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await Level.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Level.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await Level.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
