import BaseModel from "../base.model.mjs";

class Teacher extends BaseModel {
  constructor() {
    const tableName = "teachers";
    super(tableName);
  }
}

export default new Teacher();
