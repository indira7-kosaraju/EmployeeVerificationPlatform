const User = require("../models/User");
const Verification = require("../models/Verification");

// =============================
// GET ALL USERS
// =============================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const usersWithVerification = await Promise.all(
      users.map(async (user) => {
        const verification = await Verification.findOne({
          employee: user._id,
        })
          .select(
            "employeeId company designation verificationStatus verifiedBy verifiedAt blockchainHash"
          )
          .populate("verifiedBy", "name email")
          .lean();

        return {
          ...user,
          verificationStatus:
            verification?.verificationStatus || null,
          verification: verification || null,
        };
      })
    );

    res.status(200).json({
      users: usersWithVerification,
    });

  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  getAllUsers,
};
