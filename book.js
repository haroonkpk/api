const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require("./user");

// Book Schema definition
const bookSchema = mongoose.Schema({
  img: String,
  authorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  title: String,
  description: String,
  price: Number,
});

const Book = mongoose.model("book", bookSchema);

// Get all books
router.get("/book", async (req, res) => {
  try {
    const appBooks = await Book.find();
    res.status(200).send(appBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Add new book
router.post("/book", async (req, res) => {
  const { img, authorId, title, description, price } = req.body;

  // Validate request data
  if (!img || !authorId || !title || !description || !price) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const bookUser = await User.findById(authorId);
    if (!bookUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const newBook = await Book.create({
      img,
      authorId,
      title,
      description,
      price,
    });
    bookUser.books.push(newBook);
    await bookUser.save();

    res.status(201).send({ authorName: bookUser.name, newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Delete a book
router.post("/Delete", async (req, res) => {
  const { book } = req.body;

  if (!book) {
    return res.status(400).send({ message: "Missing book ID" });
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(book);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
