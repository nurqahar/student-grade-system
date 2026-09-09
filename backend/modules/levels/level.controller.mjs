import Level from "./level.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { csvParser } from "../utils/csvParser.mjs";
import { NotFoundError, ValidationError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newLevel = await Level.create(req.body);
  return successResponse(res, { data: newLevel, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.file) throw new ValidationError("Empty Data!");

  const dataCsv = await csvParser(req.file.buffer);
  if (!dataCsv || dataCsv.length === 0) throw new ValidationError("CSV File empty or has no data rows!");

  const newLevel = await Level.uploadCsv(dataCsv);
  return successResponse(res, { data: newLevel, statusCode: 201 });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Level.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  const data = await Level.getById(id);
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Level.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");
  const updated = await Level.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");

  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Level.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");
  const deleted = await Level.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
