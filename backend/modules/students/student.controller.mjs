import Students from "./student.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const created = Students.create(req.body);
  return successResponse(res, { data: created, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) return errorResponse(res, { message: "Empty Data!", statusCode: 400 })
  const newStudents = await Students.uploadCsv(req.body.data);
  return successResponse(res, { data: newStudents, statusCode: 201 });

});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Students.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");
  const data = await Students.getById(id);
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Students.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const data = await Students.update(id, req.body);
  return successResponse(res, { data: data[0] });
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Students.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const data = await Students.delete(id);
  return successResponse(res, { data: data, statusCode: 204 });
});
