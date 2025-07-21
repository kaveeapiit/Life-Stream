import {
  getUserByEmail,
  updateUserProfile,
  updatePassword,
} from '../models/UserModel.js';

// GET /api/user/profile/:email
export const fetchProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  const { email, name, bloodType } = req.body;
  try {
    await updateUserProfile(email, name, bloodType);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// PUT /api/user/profile/password
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await updatePassword(email, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};
