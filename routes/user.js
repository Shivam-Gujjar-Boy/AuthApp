const express = require("express");

const router = express.Router();

//import controllers
const { signup, login } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

//define routes
router.post("/signup", signup);
router.post("/login", login);

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to tests page",
  });
});

//protected routes
router.get("/students", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "welcome to students page",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "welcome to admins page",
  });
});

module.exports = router;
