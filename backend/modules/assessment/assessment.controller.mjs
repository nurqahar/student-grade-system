import Assessment from "./assessment.model.mjs";
import Achievement from "../achievements/achievement.model.mjs";
import HistoryStudent from "../history_student/history.model.mjs";
import Subjects from "../subjects/subject.model.mjs";
import Students from "../students/student.model.mjs";
import Classes from "../classes/class.model.mjs";

export const create = async (req, res) => {
  try {
    const newAssessment = await Assessment.create(req.body);
    return res.status(201).json(newAssessment);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  const dataCsv = req.body.data;

  // ambil semua data referensi dari db untuk mencocokkan FK
  let dataStudents;
  let dataClasses;
  let dataSubjects;
  let dataHistoryStudent;
  let dataAchievements;

  try {
    dataStudents = await Students.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }
  try {
    dataClasses = await Classes.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }
  try {
    dataSubjects = await Subjects.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }
  try {
    dataHistoryStudent = await HistoryStudent.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }
  try {
    dataAchievements = await Achievement.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }

  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    // 1. cari student lewat student_nis
    const foundStudent = dataStudents.find(
      (student) =>
        parseInt(student.student_nis, 10) === parseInt(row.student_nis, 10),
    );

    // 3. cari class lewat class_name (+ level_id kalau level ketemu, biar tidak salah kelas)
    const foundClass = dataClasses.find(
      (kelas) =>
        kelas.class_name === row.class_name && kelas.level_id === row.level_id,
    );

    // 4. cari history_student lewat student_id + school_year + semester
    //    (divalidasi silang dengan class_id kalau class ketemu)
    const foundHistory = dataHistoryStudent.find(
      (history) =>
        foundStudent &&
        history.student_id === foundStudent.id &&
        history.school_year === row.school_year &&
        parseInt(history.semester, 10) === parseInt(row.semester, 10) &&
        (!foundClass || history.class_id === foundClass.id),
    );

    // 5. cari subject lewat subject_name
    const foundSubject = dataSubjects.find(
      (subject) => subject.subject_name === row.subject_name,
    );

    // 6. cari achievement lewat subject_id + school_year + semester
    const foundAchievement =
      foundSubject &&
      dataAchievements.find(
        (achievement) =>
          achievement.subject_id === foundSubject.id &&
          achievement.school_year === row.school_year &&
          parseInt(achievement.semester, 10) === parseInt(row.semester, 10),
      );

    if (!foundHistory || !foundSubject) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      history_id: foundHistory.id,
      subject_id: foundSubject.id,
      numeric_grade: parseInt(row.numeric_grade, 10),
      letter_grade: row.letter_grade || null,
      grade_type: row.grade_type,
      achievement_id: foundAchievement ? foundAchievement.id : null,
    });
  }

  if (dataToInsert.length === 0) {
    return res.status(422).json({
      message: "Tidak ada data yang cocok dengan referensi di database",
      notFound,
    });
  }

  try {
    const inserted = await Assessment.uploadCsv(dataToInsert);
    return res.status(201).json({ inserted, notFound });
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const viewDetail = async (req, res) => {
  const className = req.query.className;
  const levelName = req.query.levelName;
  const classLevel = { levelName: levelName, className: className };
  try {
    const dataJoined = await Assessment.viewDetail(classLevel);
    return res.status(200).json(dataJoined);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getAllJoined = async (req, res) => {
  try {
    const dataJoined = await Assessment.getAllJoined();
    return res.status(200).json(dataJoined);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Assessment.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Assessment.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getByIdJoined = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Assessment.getByIdJoined(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Assessment.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await Assessment.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Assessment.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await Assessment.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
