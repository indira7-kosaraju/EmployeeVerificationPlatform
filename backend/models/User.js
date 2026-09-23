const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // User role
    role: {
      type: String,
      enum: ["employee", "hr", "admin"],
      default: "employee",
    },

    // Employee information
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    // Verification status
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);