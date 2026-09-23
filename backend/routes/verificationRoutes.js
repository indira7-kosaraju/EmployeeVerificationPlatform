const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");
const {
  createVerification,
  getMyVerification,
  getPendingVerifications,
  getVerificationHistory,
  verifyEmployee,
  publicBlockchainVerification,
  getBlockchainVerificationDetails,
  checkDataIntegrity,
} = require("../controllers/verificationController");
const router = express.Router();


// =============================
// EMPLOYEE CREATES VERIFICATION
// =============================

router.post(
  "/",
  protect,
  authorize("employee"),
  createVerification
);


// =============================
// EMPLOYEE VIEWS OWN VERIFICATION
// =============================

router.get(
  "/my",
  protect,
  authorize("employee"),
  getMyVerification
);


// =============================
// HR VIEWS PENDING REQUESTS
// =============================

router.get(
  "/pending",
  protect,
  authorize("hr", "admin"),
  getPendingVerifications
);


// =============================
// HR/ADMIN VIEWS HISTORY
// =============================

router.get(
  "/history",
  protect,
  authorize("hr", "admin"),
  getVerificationHistory
);


// =============================
// HR/ADMIN VERIFIES EMPLOYEE
// =============================

router.put(
  "/:id/verify",
  protect,
  authorize("hr", "admin"),
  verifyEmployee
);


// =============================
// PUBLIC EMPLOYEE VERIFICATION
// =============================
// IMPORTANT:
// No protect middleware here.
// Anyone can verify using the ID.

router.get(
  "/public/:id",
  publicBlockchainVerification
);


// =============================
// LOGGED-IN BLOCKCHAIN DETAILS
// =============================

router.get(
  "/:id/blockchain",
  protect,
  getBlockchainVerificationDetails
);

router.get(
  "/:id/integrity",
  protect,
  authorize("hr", "admin"),
  checkDataIntegrity
);


module.exports = router;