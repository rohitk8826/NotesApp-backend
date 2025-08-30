const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { connectDB } = require("./db");

const app = express();

// ✅ Allowlist with fallback
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-notes-app-sepia.vercel.app", // Add this as fallback
  process.env.CORS_ORIGIN,
].filter(Boolean);

// ✅ Debug: Log what origins are allowed
console.log("🌐 Allowed CORS origins:", allowedOrigins);
console.log("📝 CORS_ORIGIN env var:", process.env.CORS_ORIGIN);

// ✅ Debug log every incoming request
app.use((req, res, next) => {
  console.log("➡️", req.method, req.path, "Origin:", req.headers.origin);
  next();
});

// ✅ Enhanced CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔍 Checking origin:", origin);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("❌ Origin blocked:", origin);
      console.log("📋 Allowed origins:", allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
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
  app.listen(PORT, () => console.log(`🚀 API running on PORT ${PORT}`));
})();
