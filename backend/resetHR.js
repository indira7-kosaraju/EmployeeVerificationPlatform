const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const resetHR = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );

    const hashedPassword =
      await bcrypt.hash(
        "HR@123456",
        10
      );

    const hr =
      await User.findOneAndUpdate(
        {
          email: "hr@company.com",
        },
        {
          password: hashedPassword,
          role: "hr",
          name: "HR Manager",
        },
        {
          new: true,
        }
      );

    if (!hr) {
      console.log(
        "HR account not found"
      );

      process.exit();
    }

    console.log(
      "HR password reset successfully"
    );

    process.exit();
  } catch (error) {
    console.error(
      "Error:",
      error
    );

    process.exit(1);
  }
};

resetHR();