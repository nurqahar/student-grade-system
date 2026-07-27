import HistoryStudent from "./history.model.mjs";
import Students from "../students/student.model.mjs";
import Classes from "../classes/class.model.mjs";
import Teachers from "../teachers/teacher.model.mjs";
import Levels from "../levels/level.model.mjs";

export const create = async (req, res) => {
  try {
    const newHistoryStudent = await HistoryStudent.create(req.body);
    return res.status(201).json(newHistoryStudent);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const viewDetail = async (req, res) => {
  try {
    const data = await HistoryStudent.viewDetail();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  const dataCsv = req.body.data;

  // ambil data referensi dari db untuk mencocokkan FK
  let dataStudents;
  let dataClasses;
  let dataTeachers;
  let dataLevels;
  let level;
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
    dataLevels = await Levels.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }
  try {
    dataTeachers = await Teachers.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }

  for (const row of dataCsv) {
    level = dataLevels.find((level) => level.level_name === row.level_name);
  }

  // cocokkan tiap baris csv dengan students, classes, teachers
  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundStudent = dataStudents.find(
      (student) =>
        parseInt(student.student_nis, 10) === parseInt(row.student_nis, 10),
    );
    const foundClass = dataClasses.find(
      (kelas) =>
        kelas.class_name === row.class_name && kelas.level_id === level.id,
    );
    const foundTeacher = dataTeachers.find(
      (teacher) =>
        teacher.teacher_registration_number ===
        parseInt(row.teacher_registration_number, 10),
    );

    if (!foundStudent || !foundClass || !foundTeacher) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      student_id: foundStudent.id,
      class_id: foundClass.id,
      class_advisor_id: foundTeacher.id,
      school_year: row.school_year,
      semester: parseInt(row.semester, 10),
      class_advisor_note: row.class_advisor_note || "-",
      status: row.status,
    });
  }

  if (dataToInsert.length === 0) {
    return res.status(422).json({
      message: "Tidak ada data yang cocok dengan referensi di database",
      notFound,
    });
  }

  try {
    const inserted = await HistoryStudent.uploadCsv(dataToInsert);
    return res.status(201).json({ inserted, notFound });
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await HistoryStudent.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await HistoryStudent.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = HistoryStudent.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await HistoryStudent.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = HistoryStudent.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await HistoryStudent.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
