import Level from "./level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";
import { csvParser } from "../utils/csvParser.mjs";
import { log } from "console";

export const create = async (req, res) => {
  try {
    const newLevel = await Level.create(req.body);
    return successResponse(res, { data: newLevel, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.file) {
    return errorResponse(res, {
      message: "No File Uploaded!",
      statusCode: 400,
    });
  }

  console.log(req.file);
  console.log(req.file.buffer);
  try {
    const csvFile = await csvParser(req.file.buffer);
    if (!csvFile || csvFile.length === 0) {
      return errorResponse(res, {
        message: "CSV File empy or has no data rows!",
        statusCode: 400,
      });
    }

    const newLevel = await Level.uploadCsv(csvFile);
    return successResponse(res, { data: newLevel, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, {
      message: "Failed to upload CSV!",
      errors: error.message,
    });
  }
};

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
