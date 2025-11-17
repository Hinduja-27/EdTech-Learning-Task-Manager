const { body } = require("express-validator");

const signupValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min:6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["student","teacher"]).withMessage("Role must be student or teacher"),
  body("teacherId").if(body("role").equals("student")).notEmpty().withMessage("teacherId is required for students")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

module.exports = { signupValidation, loginValidation };
