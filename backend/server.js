require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =============================
// MIDDLEWARE
// =============================

app.use(cors());
app.use(express.json());

// =============================
// REQUEST LOGGER
// =============================

app.use((req, res, next) => {
  console.log(
    `REQUEST: ${req.method} ${req.url}`
  );
  next();
});

// =============================
// ROUTES
// =============================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/verifications",
  verificationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =============================
// TEST ROUTE
// =============================

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Employee Verification Platform API is running",
  });
});

// =============================
// MONGODB CONNECTION
// =============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(error);
  });