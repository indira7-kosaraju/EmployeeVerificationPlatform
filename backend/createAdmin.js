const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );

    // Check existing admin
    const existingAdmin =
      await User.findOne({
        email: "admin@company.com",
      });

    if (existingAdmin) {
      console.log(
        "Admin account already exists"
      );

      process.exit();
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        "Admin@123456",
        10
      );

    // Create admin
    await User.create({
      name: "System Admin",

      email: "admin@company.com",

      password: hashedPassword,

      role: "admin",
    });

    console.log(
      "Admin account created successfully"
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

createAdmin();