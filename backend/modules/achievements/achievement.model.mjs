import BaseModel from "../base.model.mjs";

class Achievement extends BaseModel {
  constructor() {
    const tableName = "achievements";
    super(tableName);
  }
}

export default new Achievement();
