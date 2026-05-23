const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUri = process.env.MONGO_URL || process.env.DB_URI;
  if (!dbUri) {
    console.error(
      "MongoDB connection failed ❌ Missing MongoDB URI."
    );
    console.error(
      "Set MONGO_URL or DB_URI in your .env file, e.g. MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB Atlas connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
