const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const { router: userRouter } = require("./user");
const cors = require("cors");
const serverless = require("serverless-http");


// CORS configuration
const corsConfig = {
  origin: process.env.CORS_ORIGIN || "*", // Optionally, use environment variable for allowed origin
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};
app.use(cors(corsConfig));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB URI from environment variable
const uri =
  "mongodb+srv://haroonkhanlala47:XoHkAxN0MxlGlrwU@store.m82ru.mongodb.net/?retryWrites=true&w=majority&appName=store";
if (!uri) {
  console.error("MongoDB URI is missing!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(uri, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Routes
const books = require("./book");
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(userRouter);
app.use(books);

// Start the server
const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown on error or termination
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

module.exports = serverless(app); // To allow testing or further usage
