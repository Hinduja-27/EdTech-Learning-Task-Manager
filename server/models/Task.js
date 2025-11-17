const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },

  // Student who is assigned this task
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  // Teacher who created the task
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },

  progress: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
