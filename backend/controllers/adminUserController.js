import {
  listUsers,
  getUserById,
  createUserRow,
  updateUserRow,
  deleteUserRow
} from '../models/UserModel.js';

export const adminListUsers = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 20, sort = 'created_at', dir = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const data = await listUsers({ search: q, limit: Number(limit), offset, sort, dir });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const adminGetUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const user = await createUserRow(req.body); // NO bcrypt.hash here!
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const user = await updateUserRow(req.params.id, req.body); // NO bcrypt.hash here!
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    await deleteUserRow(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
