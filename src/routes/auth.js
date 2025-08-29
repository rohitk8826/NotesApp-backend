// routes/auth.js
const router = require("express").Router();
const { signup, login } = require("../controllers/authController");

// Routes only delegate work to controllers
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
