const crypto = require("crypto");
const Verification = require("../models/Verification");

const {
  verifyEmployeeOnBlockchain,
  getBlockchainVerification,
} = require("../blockchain/verificationService");

// =============================
// CREATE VERIFICATION REQUEST
// =============================
const createVerification = async (req, res) => {
  try {
    const {
      employeeId,
      company,
      designation,
      joiningDate,
    } = req.body;

    if (
      !employeeId ||
      !company ||
      !designation ||
      !joiningDate
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check duplicate request
    const existingVerification =
      await Verification.findOne({
        employee: req.user.userId,
        verificationStatus: {
          $in: ["pending", "verified"],
        },
      });

    if (existingVerification) {
      return res.status(400).json({
        message:
          "You already have a pending or verified verification request",
      });
    }

    const verification =
      await Verification.create({
        employee: req.user.userId,
        employeeId,
        company,
        designation,
        joiningDate,
        verificationStatus: "pending",
      });

    res.status(201).json({
      message:
        "Verification request created successfully",
      verification,
    });
  } catch (error) {
    console.error(
      "Create verification error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create verification request",
    });
  }
};

// =============================
// GET EMPLOYEE'S OWN VERIFICATION
// =============================
const getMyVerification = async (req, res) => {
  try {
    const verification =
      await Verification.find({
        employee: req.user.userId,
      }).populate(
        "verifiedBy",
        "name email role"
      );

    res.status(200).json({
      verification,
    });
  } catch (error) {
    console.error(
      "Get verification error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch verification",
    });
  }
};

// =============================
// GET ALL PENDING VERIFICATIONS
// =============================
const getPendingVerifications = async (
  req,
  res
) => {
  try {
    const verifications =
      await Verification.find({
        verificationStatus: "pending",
      }).populate(
        "employee",
        "name email employeeId company"
      );

    res.status(200).json({
      verifications,
    });
  } catch (error) {
    console.error(
      "Get pending verifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch pending verifications",
    });
  }
};

// =============================
// VERIFY EMPLOYEE
// =============================
const verifyEmployee = async (req, res) => {
  try {
    const verification =
      await Verification.findById(
        req.params.id
      );

    if (!verification) {
      return res.status(404).json({
        message:
          "Verification record not found",
      });
    }

    if (
      verification.verificationStatus ===
      "verified"
    ) {
      return res.status(400).json({
        message:
          "Employee is already verified",
      });
    }

    // =============================
    // CREATE DATA HASH
    // =============================

    const verificationData =
      JSON.stringify({
        employeeId:
          verification.employeeId,

        company:
          verification.company,

        designation:
          verification.designation,

        joiningDate:
          verification.joiningDate,

        employmentStatus:
          verification.employmentStatus,
      });

    const dataHash = crypto
      .createHash("sha256")
      .update(verificationData)
      .digest("hex");

    // =============================
    // STORE ON BLOCKCHAIN
    // =============================

    const blockchainResult =
      await verifyEmployeeOnBlockchain(
        verification._id.toString(),
        verification.employeeId,
        dataHash
      );

    // =============================
    // UPDATE MONGODB
    // =============================

    verification.verificationStatus =
      "verified";

    verification.verifiedBy =
      req.user.userId;

    verification.verifiedAt =
      new Date();

    verification.blockchainHash =
      blockchainResult.transactionHash;

    await verification.save();

    // =============================
    // RESPONSE
    // =============================

    res.status(200).json({
      message:
        "Employee verified successfully",

      verification,

      blockchain: {
        transactionHash:
          blockchainResult.transactionHash,

        blockNumber:
          blockchainResult.blockNumber,

        dataHash,
      },
    });
  } catch (error) {
    console.error(
      "Verify employee error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to verify employee",
      error: error.message,
    });
  }
};

// =============================
// GET BLOCKCHAIN VERIFICATION
// =============================
const getBlockchainVerificationDetails =
  async (req, res) => {
    try {
      const verification =
        await Verification.findById(
          req.params.id
        );

      if (!verification) {
        return res.status(404).json({
          message:
            "Verification record not found",
        });
      }

      if (!verification.blockchainHash) {
        return res.status(400).json({
          message:
            "Verification is not stored on blockchain yet",
        });
      }

      const blockchainData =
        await getBlockchainVerification(
          verification._id.toString()
        );

      res.status(200).json({
        message:
          "Blockchain verification found",

        blockchain: {
          ...blockchainData,

          blockchainHash:
            verification.blockchainHash,

          verified: true,
        },
      });
    } catch (error) {
      console.error(
        "Blockchain verification error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch blockchain verification",

        error: error.message,
      });
    }
  };

// =============================
// CHECK BLOCKCHAIN DATA INTEGRITY
// =============================
const checkDataIntegrity = async (req, res) => {
  try {
    // =============================
    // FIND VERIFICATION IN MONGODB
    // =============================

    const verification =
      await Verification.findById(
        req.params.id
      );

    if (!verification) {
      return res.status(404).json({
        message:
          "Verification record not found",
      });
    }

    // =============================
    // CHECK BLOCKCHAIN STATUS
    // =============================

    if (!verification.blockchainHash) {
      return res.status(400).json({
        message:
          "Verification is not stored on blockchain yet",
      });
    }

    // =============================
    // CREATE CURRENT DATA HASH
    // =============================

    const verificationData =
      JSON.stringify({
        employeeId:
          verification.employeeId,

        company:
          verification.company,

        designation:
          verification.designation,

        joiningDate:
          verification.joiningDate,

        employmentStatus:
          verification.employmentStatus,
      });

    const currentDataHash = crypto
      .createHash("sha256")
      .update(verificationData)
      .digest("hex");

    // =============================
    // GET BLOCKCHAIN DATA
    // =============================

    const blockchainData =
      await getBlockchainVerification(
        verification._id.toString()
      );

    const blockchainDataHash =
      blockchainData.dataHash;

    // =============================
    // COMPARE HASHES
    // =============================

    const isIntegrityValid =
      currentDataHash ===
      blockchainDataHash;

    // =============================
    // RESPONSE
    // =============================

    res.status(200).json({
      message: isIntegrityValid
        ? "Data integrity verified"
        : "Data integrity check failed",

      integrity: {
        verified: isIntegrityValid,

        currentDataHash,

        blockchainDataHash,
      },
    });
  } catch (error) {
    console.error(
      "Data integrity check error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to check data integrity",

      error: error.message,
    });
  }
};

// =============================
// PUBLIC BLOCKCHAIN VERIFICATION
// =============================
const publicBlockchainVerification = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // Check ID
    if (!id) {
      return res.status(400).json({
        message:
          "Verification ID is required",
      });
    }

    // =============================
    // FIND VERIFICATION IN MONGODB
    // =============================

    const verification =
      await Verification.findById(id);

    if (!verification) {
      return res.status(404).json({
        message:
          "Verification record not found",
      });
    }

    // =============================
    // CHECK BLOCKCHAIN STATUS
    // =============================

    if (!verification.blockchainHash) {
      return res.status(400).json({
        message:
          "Employee has not been verified on blockchain",
      });
    }

    // =============================
    // FETCH FROM BLOCKCHAIN
    // =============================

    const blockchainData =
      await getBlockchainVerification(id);

    // =============================
    // RETURN PUBLIC RESULT
    // =============================

    res.status(200).json({
      message:
        "Employee verification successful",

      blockchain: {
        verificationId:
          blockchainData.verificationId,

        employeeId:
          blockchainData.employeeId,

        dataHash:
          blockchainData.dataHash,

        verifiedBy:
          blockchainData.verifiedBy,

        verifiedAt:
          blockchainData.verifiedAt,

        blockchainHash:
          verification.blockchainHash,

        verified: true,
      },
    });
  } catch (error) {
    console.error(
      "Public blockchain verification error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to verify employee",

      error: error.message,
    });
  }
};

// =============================
// GET VERIFICATION HISTORY
// =============================
const getVerificationHistory = async (
  req,
  res
) => {
  try {
    const verifications =
      await Verification.find()
        .populate(
          "employee",
          "name email employeeId company"
        )
        .populate(
          "verifiedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      verifications,
    });
  } catch (error) {
    console.error(
      "Get verification history error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch verification history",
    });
  }
};

// =============================
// EXPORT CONTROLLERS
// =============================
module.exports = {
  createVerification,
  getMyVerification,
  getPendingVerifications,
  verifyEmployee,
  getBlockchainVerificationDetails,
  checkDataIntegrity,
  publicBlockchainVerification,
  getVerificationHistory,
};