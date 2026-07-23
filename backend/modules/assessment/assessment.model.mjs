import BaseModel from "../base.model.mjs";

const VIEW_DETAIL_COLUMNS = [
  "assessment.id",
  "history_student.id as history_id",
  "history_student.school_year",
  "history_student.semester",
  "history_student.status",
  "students.student_nis",
  "students.student_nisn",
  "students.student_name",
  "assessment.subject_id",
  "subjects.subject_name",
  "subjects.subject_type",
  "assessment.numeric_grade",
  "assessment.letter_grade",
  "assessment.grade_type",
  "history_student.class_advisor_note",
  "levels.level_name",
  "classes.class_name",
  "achievements.competency_achievement",
  "teachers.teacher_name as class_advisor_name",
  "teachers.teacher_title as class_advisor_title",
];

class Assessment extends BaseModel {
  constructor() {
    const tableName = "assessment";
    super(tableName);
  }

  async uploadCsvChunk(dataObj) {
    const dataArray = dataObj.data.map((row) => {
      return {
        ...row,
        history_id: row.history_id ? Number(row.history_id) : 0,
        subject_id: row.subject_id ? Number(row.subject_id) : 0,
        grade: row.grade ? Number(row.grade) : 0,
      };
    });
    const chunkSize = 500;
    return await this.db.transaction(async (trx) => {
      const results = await trx.batchInsert(
        this.tableName,
        dataArray,
        chunkSize,
      );
      return results;
    });
  }

  // classLevel = { levelName, className, schoolYear?, semester? }
  // schoolYear & semester bersifat opsional (dipakai oleh modul rapor supaya
  // tidak menarik data lintas tahun/semester sekaligus).
  async viewDetail(classLevel) {
    const { className, levelName, schoolYear, semester } = classLevel;

    let query = this.db(this.tableName)
      .join("subjects", "assessment.subject_id", "=", "subjects.id")
      .join(
        "history_student",
        "assessment.history_id",
        "=",
        "history_student.id",
      )
      .join("students", "history_student.student_id", "=", "students.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .join("teachers", "history_student.class_advisor_id", "=", "teachers.id")
      .join("achievements", "assessment.achievement_id", "=", "achievements.id")
      .where("classes.class_name", `${className}`)
      .where("levels.level_name", `${levelName}`);

    if (schoolYear) {
      query = query.where("history_student.school_year", schoolYear);
    }
    if (semester) {
      query = query.where("history_student.semester", Number(semester));
    }

    const results = await query.select(...VIEW_DETAIL_COLUMNS);
    return results;
  }

  // Semua baris assessment (semua mata pelajaran) milik satu record history_student.
  // Dipakai untuk mencetak rapor satu siswa saja.
  async getByHistoryId(historyId) {
    const results = await this.db(this.tableName)
      .join("subjects", "assessment.subject_id", "=", "subjects.id")
      .join(
        "history_student",
        "assessment.history_id",
        "=",
        "history_student.id",
      )
      .join("students", "history_student.student_id", "=", "students.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .join("teachers", "history_student.class_advisor_id", "=", "teachers.id")
      .join("achievements", "assessment.achievement_id", "=", "achievements.id")
      .where("history_student.id", historyId)
      .select(...VIEW_DETAIL_COLUMNS);
    return results;
  }

  async getAllJoined() {
    const results = await this.db(this.tableName)
      .join("subjects", "assessment.subject_id", "=", "subjects.id")
      .join(
        "history_student",
        "assessment.history_id",
        "=",
        "history_student.id",
      )
      .join("students", "history_student.student_id", "=", "students.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .join("teachers", "history_student.class_advisor_id", "=", "teachers.id")
      .join("achievements", "assessment.achievement_id", "=", "achievements.id")
      .select(
        "assessment.id as assessment_id",
        "history_student.school_year",
        "history_student.semester",
        "history_student.status",
        "students.id as student_id",
        "students.student_nis",
        "students.student_nisn",
        "students.student_name",
        "assessment.subject_id",
        "subjects.subject_name",
        "subjects.subject_type",
        "assessment.numeric_grade",
        "assessment.letter_grade",
        "assessment.grade_type",
        "history_student.class_advisor_note",
        "levels.level_name",
        "classes.class_name",
        "achievements.competency_achievement",
        "teachers.teacher_name as class_advisor_name",
        "teachers.teacher_title as class_advisor_title",
      );
    return results;
  }

  async getByIdJoined(id) {
    const results = await this.db(this.tableName)
      .join("subjects", "assessment.subject_id", "=", "subjects.id")
      .join(
        "history_student",
        "assessment.history_id",
        "=",
        "history_student.id",
      )
      .join("students", "history_student.student_id", "=", "students.id")
      .join("classes", "history_student.class_id", "=", "classes.id")
      .join("levels", "classes.level_id", "=", "levels.id")
      .join("teachers", "history_student.class_advisor_id", "=", "teachers.id")
      .join("achievements", "assessment.achievement_id", "=", "achievements.id")
      .where("students.id", id)
      .select(
        "assessment.id",
        "history_student.school_year",
        "history_student.semester",
        "history_student.status",
        "students.id",
        "students.student_nis",
        "students.student_nisn",
        "students.student_name",
        "assessment.subject_id",
        "subjects.subject_name",
        "subjects.subject_type",
        "assessment.numeric_grade",
        "assessment.letter_grade",
        "assessment.grade_type",
        "history_student.class_advisor_note",
        "levels.level_name",
        "classes.class_name",
        "achievements.competency_achievement",
        "teachers.teacher_name as class_advisor_name",
        "teachers.teacher_title as class_advisor_title",
      );
    return results;
  }
}

export default new Assessment();
