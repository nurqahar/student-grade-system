import Subject from "./subject.model.mjs";
import Classes from "../classes/class.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { csvParser } from "../utils/csvParser.mjs";

export const create = asyncHandler(async (req, res) => {
  const { subject_type, order, competency_achievement, class_id } = req.body;
  const newSubject = await Subject.create({
    subject_type,
    order,
    competency_achievement,
    class_id,
  });
  return successResponse(res, { data: newSubject, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.file) throw new ValidationError("Empty Data!");

  const dataCsv = await csvParser(req.file.buffer);
  if (!dataCsv || dataCsv.length === 0) throw new ValidationError("CSV File empty or has no data rows!");

  let dataClasses;
  let dataLevels;
  let foundLevel;
  dataLevels = await Levels.getAll();
  dataClasses = await Classes.getAll();

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

    if (dataToInsert.length === 0)
      throw new ValidationError("Unmatch with reference in table");

    const inserted = await Subject.uploadCsv(dataToInsert);
    return successResponse(res, {
      data: inserted,
      statusCode: 201,
    });
  }
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Subject.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const data = await Subject.getById({ id });
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Subject.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const updated = await Subject.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Subject.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const deleted = await Subject.delete(id);
  return successResponse(res, { data: deleted, statusCode: 204 });
});
