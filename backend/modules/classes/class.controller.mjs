import Classes from "./class.model.mjs";
import Levels from "../levels/level.model.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

export const create = async (req, res) => {
  try {
    const newClasses = await Classes.create(req.body);
    return successResponse(res, { data: newClasses, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return errorResponse(res, { message: "Empty Data!", statusCode: 400 });
  }

  const dataCsv = req.body.data;

  // ambil data levels dari db untuk mencocokkan level_name -> level_id
  let dataLevels;
  try {
    dataLevels = await Levels.getAll();
  } catch (error) {
    return errorResponse(res, { errors: error });
  }

  // cocokkan tiap baris csv dengan levels, lalu bentuk data siap insert
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

  try {
    const inserted = await Classes.uploadCsv(dataToInsert);
    return successResponse(res, { data: inserted, statusCode: 201 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const viewDetail = async (req, res) => {
  try {
    const data = await Classes.viewDetail();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Classes.getAll();
    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return errorResponse(res, {
      message: "ID tidak valid!",
      statusCode: 400,
    });
  }

  try {
    const data = await Classes.getById(id);

    if (!data) {
      return errorResponse(res, {
        message: "Data not found!",
        statusCode: 404,
      });
    }

    return successResponse(res, { data: data });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const update = async (req, res) => {
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

  try {
    const updated = await Classes.update(id, req.body);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};

export const deleteData = async (req, res) => {
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

  try {
    const deleted = await Classes.delete(id);
    return successResponse(res, { data: deleted, statusCode: 204 });
  } catch (error) {
    return errorResponse(res, { errors: error });
  }
};
