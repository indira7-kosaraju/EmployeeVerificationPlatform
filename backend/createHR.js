const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createHR = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );

    const existingHR =
      await User.findOne({
        email: "hr@company.com",
      });

    if (existingHR) {
      console.log(
        "HR account already exists"
      );

      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        "HR@123456",
        10
      );

    await User.create({
      name: "HR Manager",

      email: "hr@company.com",

      password: hashedPassword,

      role: "hr",
    });

    console.log(
      "HR account created successfully"
    );

    process.exit();
  } catch (error) {
    console.error(
      "Error creating HR:",
      error
    );

    process.exit(1);
  }
};

createHR();