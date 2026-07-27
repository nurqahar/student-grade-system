import Subject from "./subject.model.mjs";

export const create = async (req, res) => {
  try {
    const newSubject = await Subject.create(req.body);
    return res.status(201).json(newSubject);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }
  try {
    const newSubject = await Subject.uploadCsv(req.body.data);
    return res.status(201).json(newSubject);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Subject.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Subject.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Subject.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await Subject.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Subject.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await Subject.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
