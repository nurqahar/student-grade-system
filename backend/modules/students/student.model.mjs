import BaseModel from "../base.model.mjs";

class Student extends BaseModel {
  constructor() {
    const tableName = "students";
    super(tableName);
  }
}

export default new Student();
