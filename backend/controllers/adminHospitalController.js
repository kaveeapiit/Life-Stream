// backend/controllers/adminHospitalController.js
import {
  listHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../models/HospitalUserModel.js";

export const adminListHospitals = async (req, res, next) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const data = await listHospitals({ q, limit: parseInt(limit), offset });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const adminGetHospital = async (req, res, next) => {
  try {
    const row = await getHospital(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
};

export const adminCreateHospital = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(422)
        .json({ message: "username and password required" });
    }
    const row = await createHospital({ username, password });
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
};

export const adminUpdateHospital = async (req, res, next) => {
  try {
    const row = await updateHospital(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
};

export const adminDeleteHospital = async (req, res, next) => {
  try {
    await deleteHospital(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
