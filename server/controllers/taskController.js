// server/controllers/taskController.js
const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");

/**
 * Create Task
 * - Only teachers can create tasks
 * - Teacher assigns to a student (assignedTo)
 * - createdBy = teacher
 */
exports.createTask = async (req, res, next) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can create tasks" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { title, description = "", dueDate, assignedTo } = req.body;

    // Validate assignedTo belongs to this teacher
    const student = await User.findOne({ _id: assignedTo, role: "student", teacherId: req.user.id });
    if (!student) {
      return res.status(403).json({ success: false, message: "You can only assign tasks to your own students" });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      progress: "not-started",
      assignedTo: student._id,
      createdBy: req.user.id
    });

    await newTask.save();

    // optionally populate small payload
    const payload = await Task.findById(newTask._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({ success: true, message: "Task created successfully", task: payload });
  } catch (err) {
    next(err);
  }
};

/**
 * Get tasks
 * - Student: tasks where assignedTo = user
 * - Teacher: tasks createdBy = teacher (created) and tasks assignedTo teacher's students (studentTasks)
 */
exports.getTasks = async (req, res, next) => {
  try {
    if (req.user.role === "student") {
      const tasks = await Task.find({ assignedTo: req.user.id })
        .sort({ dueDate: 1 })
        .populate("createdBy", "name email");
      return res.json({ success: true, tasks });
    }

    // teacher flow
    const created = await Task.find({ createdBy: req.user.id })
      .sort({ dueDate: 1 })
      .populate("assignedTo", "name email");

    // find students of this teacher
    const students = await User.find({ teacherId: req.user.id }, "_id");
    const studentIds = students.map(s => s._id);

    const studentTasks = await Task.find({ assignedTo: { $in: studentIds } })
      .sort({ dueDate: 1 })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    return res.json({ success: true, tasks: { created, studentTasks } });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Task
 * - Student: can update only progress on tasks assignedTo them
 * - Teacher: can update full task only if createdBy = teacher
 */
exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // Student: only update progress and only if assignedTo them
    if (req.user.role === "student") {
      if (task.assignedTo.toString() !== req.user.id)
        return res.status(403).json({ success: false, message: "Access denied" });

      if (req.body.progress) task.progress = req.body.progress;
      await task.save();
      const updated = await Task.findById(task._id).populate("createdBy", "name email");
      return res.json({ success: true, task: updated });
    }

    // Teacher: only if createdBy teacher
    if (req.user.role === "teacher") {
      if (task.createdBy.toString() !== req.user.id)
        return res.status(403).json({ success: false, message: "Access denied. You can only edit tasks you created." });

      task.title = req.body.title ?? task.title;
      task.description = req.body.description ?? task.description;
      task.dueDate = req.body.dueDate ?? task.dueDate;
      task.progress = req.body.progress ?? task.progress;

      await task.save();
      const updated = await Task.findById(task._id)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
      return res.json({ success: true, task: updated });
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Task
 * - Only teacher who created the task can delete it
 * - Students cannot delete tasks (assignment requirement)
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (req.user.role !== "teacher")
      return res.status(403).json({ success: false, message: "Only the teacher who created the task can delete it" });

    if (task.createdBy.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Access denied. You can only delete your created tasks." });

    await Task.findByIdAndDelete(taskId);
    return res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
