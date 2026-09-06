import Teacher from "./teacher.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { ValidationError, NotFoundError } from "../errors/AppError.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";

export const create = asyncHandler(async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    return successResponse(res, { data: newTeacher, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});

export const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }
  try {
    const newTeacher = await Teacher.uploadCsv(req.body.data);
    return successResponse(res, { data: newTeacher, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});

export const getAll = asyncHandler(async (req, res) => {
  try {
    const data = await Teacher.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});

export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Teacher.getById({ id });
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});

export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Teacher.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const updated = await Teacher.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});

export const deleteData = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Teacher.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const deleted = await Teacher.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
});
