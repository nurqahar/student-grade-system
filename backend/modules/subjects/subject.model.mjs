import BaseModel from "../base.model.mjs";

class Subject extends BaseModel {
  constructor() {
    const tableName = "subjects";
    super(tableName);
  }
  async getByName(subject_name) {
    const data = await this.db(this.tableName).select().where(subject_name);
    return data;
  }
}

export default new Subject();
