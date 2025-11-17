const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return res.status(401).json({ success:false, message: "No token provided. Access denied." });

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message: "Invalid or expired token." });
  }
};
