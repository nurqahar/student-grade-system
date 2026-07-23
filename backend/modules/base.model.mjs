import db from "../db/knex.mjs";

export default class BaseModel {
  constructor(tableNameParam) {
    this.tableName = tableNameParam;
    this.db = db;
  }
  async create(data) {
    const [created] = await this.db(this.tableName).insert({ ...data }, "*");
    return created;
  }

  async getAll() {
    return this.db(this.tableName).select();
  }

  async getById(id) {
    const data = await this.db(this.tableName).select().where(id);
    return data;
  }

  async update(id, updateData) {
    const updated = await this.db(this.tableName)
      .where({ id })
      .update(updateData, "*");
    return updated;
  }

  async delete(id) {
    const deleted = await this.db(this.tableName).where({ id }).del("*");
    return deleted;
  }

  async uploadCsv(dataToInsert) {
    const inserted = await this.db.transaction(async (trx) => {
      return await trx(this.tableName).insert(dataToInsert);
    });
    return inserted;
  }
}
