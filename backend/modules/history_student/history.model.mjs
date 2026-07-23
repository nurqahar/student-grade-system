import BaseModel from "../base.model.mjs";

class HistoryStudent extends BaseModel {
  constructor() {
    const tableName = "history_student";
    super(tableName);
  }

  async viewDetail() {
    const results = await this.db(this.tableName)
      .join("students", "history_student.student_id", "=", "students.id")
      .join("teachers", "history_student.class_advisor_id", "=", "teachers.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .select(
        "history_student.id",
        "levels.level_name",
        "classes.class_name",
        "students.student_nis",
        "students.student_nisn",
        "students.student_name",
        "history_student.status",
        "teachers.teacher_name",
        "teachers.teacher_title",
        "history_student.school_year",
        "history_student.semester",
      );
    return results;
  }
}

export default new HistoryStudent();
