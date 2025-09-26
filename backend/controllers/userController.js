import {
  getUserByEmail,
  updateUserProfile,
  updatePassword,
  updateContactInfo,
  updatePhoneNumber,
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

// PUT /api/user/profile/contact
export const updateContact = async (req, res) => {
  const { currentEmail, newEmail, phone } = req.body;
  try {
    await updateContactInfo(currentEmail, newEmail, phone);
    res.json({ message: 'Contact information updated successfully', success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact information' });
  }
};

// PUT /api/user/profile/phone
export const updatePhone = async (req, res) => {
  const { email, phone } = req.body;
  try {
    await updatePhoneNumber(email, phone);
    res.json({ message: 'Phone number updated successfully', success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update phone number' });
  }
};
