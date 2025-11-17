// server/controllers/authController.js
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { name = "", email, password, role, teacherId } = req.body;

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    let finalTeacherId = null;
    if (role === "student") {
      if (!teacherId) return res.status(400).json({ success: false, message: "Teacher must be selected for students" });

      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== "teacher")
        return res.status(400).json({ success: false, message: "Invalid teacher selected" });

      finalTeacherId = teacher._id;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      teacherId: finalTeacherId
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      teacherId: user.teacherId || null,
      name: user.name || null
    });
  } catch (err) {
    next(err);
  }
};
