import Students from "./student.model.mjs";

export const create = async (req, res) => {
  const class_id = parseInt(req.params.class_id, 10);

  try {
    const created = Students.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.body.data || req.body.data.length === 0) {
    return res.send("Empty data");
  }

  try {
    const newStudents = await Students.uploadCsv(req.body.data);
    return res.status(201).json(newStudents);
  } catch (error) {
    return res.status(422).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Students.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = await Students.getById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dataId = Students.getById(id);
  if (!dataId) return res.status(404).send("id Not Found!");

  try {
    const data = await Students.update(id, req.body);
    return res.status(200).json(data[0]);
  } catch (error) {
    return res.status(409).json(error);
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(404).send("id Not Found!");
  try {
    const data = await Students.delete(id);
    return res.status(204).json(data);
  } catch (error) {
    return res.status(409).json(error);
  }
};
