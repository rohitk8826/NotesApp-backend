const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { connectDB } = require("./db");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://mern-notes-app-sepia.vercel.app", // vercel frontend
];

// ✅ Proper dynamic origin check
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Ensure preflight requests always handled
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api", require("./routes/health"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(500).json({ success: false, message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 8080;
(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`✅ API running on PORT ${PORT}`));
})();
