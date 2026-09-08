import Teacher from "./teacher.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  const newTeacher = await Teacher.create(req.body);
  return successResponse(res, { data: newTeacher, statusCode: 201 });
});

export const uploadCsv = asyncHandler(async (req, res) => {

  if (!req.body.data || req.body.data.length === 0) return errorResponse(res, { message: "Empty Data!", statusCode: 400 })
  const newTeacher = await Teacher.uploadCsv(req.body.data);
  return successResponse(res, { data: newTeacher, statusCode: 201 });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await Teacher.getAll();
  return successResponse(res, { data: data });
});

export const getById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const data = await Teacher.getById({ id });
  return successResponse(res, { data: data });
});

export const update = asyncHandler(async (req, res) => {

  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Teacher.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const updated = await Teacher.update(id, req.body);
  return successResponse(res, { data: updated });
});

export const deleteData = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ValidationError("Please Input id first!");
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new ValidationError("Id is Not a Number or Zero number");

  const dataId = Teacher.getById(id);
  if (!dataId) throw new NotFoundError("Level Not Found!");

  const deleted = await Teacher.delete(id);

  return successResponse(res, { data: deleted, statusCode: 204 });
});
