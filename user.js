const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// User Schema definition
const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "USER",
  },
  books: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "book",
    },
  ],
});

let User = mongoose.model("user", userSchema);

// Create new user
router.post("/user", async (req, res) => {
  const { fullname, email, password, role } = req.body;

  // Basic validation
  if (!fullname || !email || !password) {
    return res.status(400).send({ message: "Required fields are missing" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const createdUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).send(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all users
router.get("/user", async (req, res) => {
  try {
    const appUsers = await User.find();
    res.status(200).send(appUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordCorrect) {
      const token = jwt.sign(
        { email: existingUser.email, role: existingUser.role },
        process.env.JWT_SECRET || "defaultSecretKey", // Use a secure key from environment variables
        { expiresIn: "24h" }
      );
      res.status(200).send({ user: existingUser, token, success: true });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = { User, router };