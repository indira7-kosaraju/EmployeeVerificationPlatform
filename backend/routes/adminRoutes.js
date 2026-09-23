const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAllUsers,
} = require("../controllers/adminController");

const router = express.Router();

// =============================
// ADMIN - GET ALL USERS
// =============================

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

module.exports = router;