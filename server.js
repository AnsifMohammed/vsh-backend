require("dotenv").config(); // ✅ Must be loaded first before any env vars are used
const app = require("./src/app");
const connectDB = require('./src/config/db');
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});