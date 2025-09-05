import bcrypt from 'bcrypt';

async function generateHashes() {
  const password = 'hospital123';
  const saltRounds = 10;
  
  console.log('Generating bcrypt hash for password:', password);
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation:', isValid);
    
    console.log('\nSQL Update Command:');
    console.log(`UPDATE hospital_users SET password = '${hash}' WHERE username IN ('Hospital', 'Kandy', 'Colombo', 'Jaffna', 'Galle', 'Badulla');`);
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHashes();
