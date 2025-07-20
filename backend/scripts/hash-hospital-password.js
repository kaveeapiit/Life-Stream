// hash-hospital-password.js
import bcrypt from 'bcryptjs';

const generate = async () => {
  const hashed = await bcrypt.hash('1234', 10);
  console.log('HASHED PASSWORD:', hashed);
};

generate();
