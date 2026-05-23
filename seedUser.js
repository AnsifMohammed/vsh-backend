const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/user');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected ✅');

        const users = [
            {
                name: 'Test User',
                email: 'user@vsh.com',
                password: 'user@123',
                phoneNumber: '9876543210',
                dateOfBirth: new Date('1995-06-15'),
                role: 'user',
            },
            {
                name: 'Admin',
                email: 'admin@vsh.com',
                password: 'admin@123',
                phoneNumber: '9000000000',
                dateOfBirth: new Date('1990-01-01'),
                role: 'admin',
            },
        ];

        for (const userData of users) {
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
                console.log(`⚠️  User already exists: ${userData.email} — skipping`);
                continue;
            }
            const user = new User(userData);
            await user.save(); // triggers bcrypt pre-save hook
            console.log(`✅ Created: ${userData.email} (role: ${userData.role})`);
        }

        console.log('\n🎉 Done! Use these credentials to login:');
        console.log('─────────────────────────────────────');
        console.log('👤 Regular User');
        console.log('   Email   : user@vsh.com');
        console.log('   Password: user@123');
        console.log('');
        console.log('🔑 Admin User');
        console.log('   Email   : admin@vsh.com');
        console.log('   Password: admin@123');
        console.log('─────────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedUsers();
