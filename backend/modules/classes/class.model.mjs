import BaseModel from "../base.model.mjs";

class Class extends BaseModel {
  constructor() {
    const tableName = "classes";
    super(tableName);
  }
  async viewDetail() {
    const results = await this.db(this.tableName)
      .join("levels", "classes.level_id", "=", "levels.id")
      .select("classes.id", "levels.level_name", "classes.class_name");
    return results;
  }
}

export default new Class();
