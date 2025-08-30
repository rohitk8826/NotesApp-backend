const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { connectDB } = require("./db");

const app = express();

// Allowlist
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
].filter(Boolean);

// ✅ CORS setup for JWT (no cookies)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // ❌ Remove credentials: true (only for cookies, not for JWT headers)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

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
