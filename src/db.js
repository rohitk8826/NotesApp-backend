// db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    mongoose.set("strictQuery", true); // avoid deprecation warnings

    await mongoose.connect(process.env.MONGODB_URI, {});

    console.log("✅ MongoDB connected");

    // Optional: listen for connection events
    mongoose.connection.on("error", (err) =>
      console.error("❌ MongoDB connection error:", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.warn("⚠️ MongoDB disconnected")
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
