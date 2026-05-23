const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Counter = require('./src/models/counter');

// Load env vars
dotenv.config();

const seedData = {
    familiesHelped: 1250,
    babiesDelivered: 680,
    yearsExperience: 18,
    googleRating: 4.9
};

const seedCounter = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected ✅');

        // Clear existing data (optional, but good for starting fresh)
        await Counter.deleteMany({});
        console.log('Cleared existing counters');

        // Create new data
        await Counter.create(seedData);
        console.log('Counter data seeded successfully! 🚀');
        console.log(seedData);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data ❌', error.message);
        process.exit(1);
    }
};

seedCounter();
