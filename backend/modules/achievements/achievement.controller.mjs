import Achievement from "./achievement.model.mjs";
import Subjects from "../subjects/subject.model.mjs";

export const create = async (req, res) => {
  try {
    const newAchievement = await Achievement.create(req.body);
    return res.status(201).json(newAchievement);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  const dataCsv = req.body.data;

  // ambil data subjects dari db untuk mencocokkan subject_name -> subject_id
  let dataSubjects;
  try {
    dataSubjects = await Subjects.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }

  // cocokkan tiap baris csv dengan subjects, lalu bentuk data siap insert
  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundSubject = dataSubjects.find(
      (subject) => subject.subject_name === row.subject_name,
    );

    if (!foundSubject) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      subject_id: foundSubject.id,
      competency_achievement: row.competency_achievement,
      school_year: row.school_year,
      semester: parseInt(row.semester, 10),
    });
  }

  if (dataToInsert.length === 0) {
    return res.status(422).json({
      message: "Tidak ada data yang cocok dengan subject di database",
      notFound,
    });
  }

  try {
    const inserted = await Achievement.uploadCsv(dataToInsert);
    return res.status(201).json({ inserted, notFound });
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const viewDetail = async (req, res) => {
  const className = req.query.className;
  try {
    const dataJoined = await Achievement.viewDetail(className);
    return res.status(200).json(dataJoined);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getAllJoined = async (req, res) => {
  try {
    const dataJoined = await Achievement.getAllJoined();
    return res.status(200).json(dataJoined);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Achievement.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Achievement.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Achievement.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await Achievement.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Achievement.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await Achievement.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
