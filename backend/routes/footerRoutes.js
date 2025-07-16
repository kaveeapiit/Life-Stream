import express from 'express';
const router = express.Router();

// Dummy footer data
router.get('/', (req, res) => {
  res.json({
    phone: '+94 77 123 4567',
    email: 'info@lifestream.lk',
    address: '123 Red Cross Road, Colombo, Sri Lanka'
  });
});

export default router;
