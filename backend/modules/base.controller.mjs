import { successResponse, errorResponse } from "./utils/response.mjs";

export default class BaseController {
  constructor(model) {
    this.model = model;

    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req, res) {
    try {
      const createdData = await this.model.create(req.body);
      return successResponse(res, { data: createdData, statusCode: 201 });
    } catch (error) {
      return errorResponse(res, { errors: error });
    }
  }

  async getAll(req, res) {
    try {
      const data = await this.model.getAll();
      return successResponse(res, { data: data });
    } catch (error) {
      return errorResponse(res, { errors: error });
    }
  }

  async getById(req, res) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      return errorResponse(res, {
        message: "ID tidak valid!",
        statusCode: 400,
      });
    }

    try {
      const data = await this.model.getById(id);

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
  }

  async update(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return errorResponse(res, {
        message: "ID tidak valid!",
        statusCode: 400,
      });
    }

    const dataId = this.model.getById(id);
    if (!dataId)
      return errorResponse(res, {
        message: "id Not Found!",
        statusCode: 404,
        data: null,
      });

    try {
      const updated = await this.model.update(id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      return errorResponse(res, { errors: error });
    }
  }

  async deleteData(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return errorResponse(res, {
        message: "ID tidak valid!",
        statusCode: 400,
      });
    }

    const dataId = this.model.getById(id);
    if (!dataId)
      return errorResponse(res, {
        message: "id Not Found!",
        statusCode: 404,
        data: null,
      });

    try {
      const deleted = await this.model.delete(id);
      return successResponse(res, { data: deleted, statusCode: 204 });
    } catch (error) {
      return errorResponse(res, { errors: error });
    }
  }
}
