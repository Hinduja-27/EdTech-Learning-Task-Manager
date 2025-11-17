const { body, param } = require("express-validator");

const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("assignedTo").notEmpty().withMessage("assignedTo (studentId) is required").isMongoId()
];

const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("progress").optional().isIn(["not-started", "in-progress", "completed"])
];

module.exports = { createTaskValidation, updateTaskValidation };
