const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { connectDB } = require("./db");

const app = express();

// Allowlist
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN, // e.g. https://mern-notes-app-sepia.vercel.app
].filter(Boolean);

// ✅ Debug log every incoming request
app.use((req, res, next) => {
  console.log("➡️", req.method, req.path, "Origin:", req.headers.origin);
  next();
});

// ✅ Single CORS setup (used everywhere)
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/health", require("./routes/health"));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ success: false, message: "Server Error" });
});

// Start
const PORT = process.env.PORT || 8080;
(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API running on PORT ${PORT}`));
})();
