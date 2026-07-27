import Level from "./level.model.mjs";

export const create = async (req, res) => {
  try {
    const newLevel = await Level.create(req.body);
    return res.status(201).json(newLevel);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  try {
    const newLevel = await Level.uploadCsv(req.body.data);
    return res.status(201).json(newLevel);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Level.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Level.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Level.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await Level.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Level.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await Level.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
