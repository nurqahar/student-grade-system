import Classes from "./class.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newClasses = await Classes.create(req.body);
  return successResponse(res, { data: newClasses, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0)
    throw new ValidationError("Empty Data!");

  const dataCsv = req.body.data;

  let dataLevels;
  dataLevels = await Levels.getAll();

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

  if (dataToInsert.length === 0)
    throw new ValidationError("Unmatch with reference in table");

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
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);

  const data = await Classes.getById(id);
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Classes.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const updated = await Classes.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = await Classes.getById(id);
  if (!dataId) throw new NotFoundError("ID Not Found!");

  const deleted = await Classes.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
