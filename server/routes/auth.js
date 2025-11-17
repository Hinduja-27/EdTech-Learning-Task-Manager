const express = require("express");
const { signup, login } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../validators/authValidators");
const { validationResult } = require("express-validator");
const router = express.Router();

router.post("/signup", signupValidation, (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success:false, message: errors.array()[0].msg });
  next();
}, signup);

router.post("/login", loginValidation, (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success:false, message: errors.array()[0].msg });
  next();
}, login);

module.exports = router;
