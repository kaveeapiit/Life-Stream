export default function hospitalAuth(req, res, next) {
  if (!req.session || !req.session.hospital) {
    return res.status(401).json({ error: 'Unauthorized: Hospital login required' });
  }
  next();
}
