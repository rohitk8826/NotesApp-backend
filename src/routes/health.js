// routes/health.js
const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "API is running",
  });
});

module.exports = router;
