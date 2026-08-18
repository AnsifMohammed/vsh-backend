const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const dbUri = process.env.MONGO_URL || process.env.DB_URI;
  if (!dbUri) {
    console.error("MongoDB connection failed ❌ Missing MONGO_URL/DB_URI environment variable in Vercel settings.");
    return;
  }

  try {
    const db = await mongoose.connect(dbUri);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Atlas connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
  }
};

module.exports = connectDB;
