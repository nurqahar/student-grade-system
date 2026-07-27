import BaseModel from "../base.model.mjs";

class Absence extends BaseModel {
  constructor() {
    const tableName = "absence";
    super(tableName);
  }

  // classLevel = { levelName, className, schoolYear?, semester? }
  async viewDetail(classLevel) {
    const { className, levelName, schoolYear, semester } = classLevel;

    let query = this.db(this.tableName)
      .join("history_student", "absence.history_id", "=", "history_student.id")
      .join("students", "history_student.student_id", "=", "students.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .where("classes.class_name", `${className}`)
      .where("levels.level_name", `${levelName}`);

    if (schoolYear) {
      query = query.where("history_student.school_year", schoolYear);
    }
    if (semester) {
      query = query.where("history_student.semester", Number(semester));
    }

    const result = await query.select(
      "absence.id",
      "history_student.id as history_id",
      "levels.level_name",
      "classes.class_name",
      "students.student_name",
      "absence.sakit",
      "absence.izin",
      "absence.alpa",
    );
    return result;
  }

  // Data absensi milik satu record history_student saja.
  async getByHistoryId(historyId) {
    const result = await this.db(this.tableName)
      .join("history_student", "absence.history_id", "=", "history_student.id")
      .where("history_student.id", historyId)
      .select(
        "absence.id",
        "history_student.id as history_id",
        "absence.sakit",
        "absence.izin",
        "absence.alpa",
      );
    return result;
  }
}

export default new Absence();
