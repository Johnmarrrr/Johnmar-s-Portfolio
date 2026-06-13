const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const newPassword = process.argv[2];
if (!newPassword) {
  console.error('Error: Please provide a new password.');
  console.error('Usage: node change-password.js <new_password>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // Locate the admin user
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.error('Error: Admin user not found in the database.');
      process.exit(1);
    }
    
    // Assign the new password (the User model pre-save hook will automatically hash it)
    admin.password = newPassword;
    await admin.save();
    console.log(`Success: Changed password for user "admin".`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
