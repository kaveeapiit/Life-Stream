import { getAboutInfo } from '../models/AboutModel.js';

export const fetchAboutContent = (req, res) => {
  const data = getAboutInfo();
  res.json(data);
};
