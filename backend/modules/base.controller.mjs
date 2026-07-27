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
}
