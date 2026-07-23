import BaseModel from "../base.model.mjs";

class Level extends BaseModel {
  constructor() {
    const tableName = "levels";
    super(tableName);
  }
}

export default new Level();
