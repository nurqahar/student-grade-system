import Teacher from "./teacher.model.mjs";

export const create = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    return res.status(201).json(newTeacher);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }
  try {
    const newTeacher = await Teacher.uploadCsv(req.body.data);
    return res.status(201).json(newTeacher);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Teacher.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Teacher.getById({ id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Teacher.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const updated = await Teacher.update(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Teacher.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const deleted = await Teacher.delete(id);
    return res.status(204).json(deleted);
  } catch (error) {
    return res.status(409).json(error);
  }
};
