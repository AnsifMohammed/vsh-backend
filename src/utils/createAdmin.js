/**
 * Admin User Creation Utility
 * 
 * Usage:
 *   node src/utils/createAdmin.js <email> [password]
 * 
 * Or run without arguments to see instructions
 */

const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email) {
    console.log(`
Usage:
  node src/utils/createAdmin.js <email> [password]

Examples:
  # Create new admin user
  node src/utils/createAdmin.js admin@hospital.com adminpassword123
  
  # Promote existing user to admin
  node src/utils/createAdmin.js user@example.com

Note: Make sure MongoDB is running before running this script.
`);
    process.exit(1);
  }

  try {
    // Connect to database
    const dbUri = process.env.MONGO_URL || process.env.DB_URI;
    if (!dbUri) {
      console.error('Error: MONGO_URL (or DB_URI) environment variable not set in .env');
      console.error('Add this line to your .env file:');
      console.error('  MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }
    
    await mongoose.connect(dbUri);
    console.log('Connected to database');

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user to admin
      user.role = 'admin';
      await user.save();
      console.log(`✓ User ${email} promoted to admin`);
    } else {
      // Create new admin user
      if (!password) {
        console.error('Error: Password required to create new admin user');
        process.exit(1);
      }
      
      const name = email.split('@')[0];
      user = new User({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        phoneNumber: '0000000000',
        dateOfBirth: new Date('1990-01-01'),
        password,
        role: 'admin'
      });
      
      await user.save();
      console.log(`✓ Admin user ${email} created successfully`);
    }
    
    console.log('\nUser details:');
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  ID: ${user._id}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

createAdmin();