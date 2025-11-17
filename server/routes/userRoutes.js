// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Public - list all teachers (for student signup dropdown)
router.get("/teachers", async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id name email");
    res.json({ success: true, teachers });
  } catch (err) {
    next(err);
  }
});

// Protected - teacher fetches their own students
router.get("/my-students", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can access their students" });
    }

    const students = await User.find({ teacherId: req.user.id }).select("_id name email");
    res.json({ success: true, students });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
