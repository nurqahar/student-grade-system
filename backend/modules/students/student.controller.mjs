import Students from "./student.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  const class_id = parseInt(req.params.class_id, 10);

  try {
    const created = Students.create(req.body);
    return successResponse(res, { data: created, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  try {
    const newStudents = await Students.uploadCsv(req.body.data);
    return successResponse(res, { data: newStudents, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Students.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Students.getById(id);
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Students.getById(id);
  if (!dataId)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });

  try {
    const data = await Students.update(id, req.body);
    return successResponse(res, { data: data[0] });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id)
    return errorResponse(res, {
      message: "id Not Found!",
      statusCode: 404,
      data: null,
    });
  try {
    const data = await Students.delete(id);
    return successResponse(res, { data: data, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
