const User = require("../models/User");

exports.getAssignedStudents = async (req, res, next) => {
  try {
    if (req.user.role !== "teacher") return res.status(403).json({ success:false, message:"Only teachers can fetch assigned students" });
    const students = await User.find({ teacherId: req.user.id }).select("_id name email");
    res.json({ success:true, students });
  } catch (err) { next(err); }
};

exports.getTeacherById = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id).select("_id name email");
    if (!teacher) return res.status(404).json({ success:false, message:"Teacher not found" });
    res.json({ success:true, teacher });
  } catch (err) { next(err); }
};
