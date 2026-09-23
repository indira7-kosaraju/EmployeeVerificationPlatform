const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Test protected profile route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Employee only
router.get("/employee", protect, authorize("employee"), (req, res) => {
  res.status(200).json({
    message: "Employee access granted",
    user: req.user,
  });
});

// HR only
router.get("/hr", protect, authorize("hr"), (req, res) => {
  res.status(200).json({
    message: "HR access granted",
    user: req.user,
  });
});

// Admin only
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
    user: req.user,
  });
});

module.exports = router;