import Classes from "./class.model.mjs";
import Levels from "../levels/level.model.mjs";

export const create = async (req, res) => {
  try {
    const created = await Classes.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  const dataCsv = req.body.data;

  // ambil data levels dari db untuk mencocokkan level_name -> level_id
  let dataLevels;
  try {
    dataLevels = await Levels.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }

  // cocokkan tiap baris csv dengan levels, lalu bentuk data siap insert
  const dataToInsert = [];
  const notFound = [];

  for (const row of dataCsv) {
    const foundLevel = dataLevels.find(
      (level) => level.level_name === row.level_name,
    );

    if (!foundLevel) {
      notFound.push(row);
      continue;
    }

    dataToInsert.push({
      level_id: foundLevel.id,
      class_name: row.class_name,
    });
  }

  if (dataToInsert.length === 0) {
    return res.status(422).json({
      message: "Tidak ada data yang cocok dengan level di database",
      notFound,
    });
  }

  try {
    const inserted = await Classes.uploadCsv(dataToInsert);
    return res.status(201).json({ inserted, notFound });
  } catch (error) {
    return res.status(422).json(error);
  }
};

//reserved
export const uploadCsv_res = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  // variabel untuk simpan data yang akan di insert ke tabel
  let dataToInsert = [];

  // buat cache dari db
  let dataLevel;

  // simpan data csv
  const dataCsv = req.body.data;

  // ambil data dari tabel db
  try {
    dataLevel = await Levels.getAll();
  } catch (error) {
    return res.status(422).json(error);
  }

  // cocokkan data csv dengan db
  for (const element of dataCsv) {
    const found = dataLevel.find(
      (level) => element.level_name === level.level_name,
    );
    if (found)
      dataToInsert.push({ level_id: found.id, class_name: element.class_name });
  }

  // insert data to tabel
  try {
    const newClasses = Classes.uploadCsv(dataToInsert);
    return res.status(201).json(newClasses);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const viewDetail = async (req, res) => {
  try {
    const dataJoined = await Classes.viewDetail();
    return res.status(200).json(dataJoined);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Classes.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Classes.getById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Classes.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const data = await Classes.update(id, req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(404).send("id Not Found!");
  try {
    const data = await Classes.delete(id);
    return res.status(204).json(data);
  } catch (error) {
    return res.status(409).json(error);
  }
};
