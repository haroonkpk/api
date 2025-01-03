const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require("./user");

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

router.get("/book", async (req, res) => {
  let appBooks = await Book.find();

  res.send(appBooks);
});

router.post("/book", async (req, res) => {
  let { img, authorId, title, description, price } = req.body;
  let bookUser = await User.findOne({ _id: authorId });
  let newBook = await Book.create({ img, authorId, title, description, price });
  bookUser.books.push(newBook);
  bookUser.save();
  res.send({ authorName: bookUser.name, newBook });
});

router.post("/Delete", async (req, res) => {
  const { book } = req.body;
  const dbook = await Book.findOneAndDelete({ _id: book });
});

module.exports = router;
