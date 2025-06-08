const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({ username, password });
  return res.status(201).json({message: "User registered successfully"});
});

// Login endpoint - moved from auth_users to general routes
public_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({message: "Invalid credentials"});
  }

  const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
  return res.status(200).json({token, username});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json({
    message: "Books retrieved successfully",
    total_books: Object.keys(books).length,
    books: Object.values(books)
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json({
      message: "Book retrieved successfully",
      book: books[isbn]
    });
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books)
    .filter(book => book.author.toLowerCase() === author.toLowerCase());
  
  if (booksByAuthor.length > 0) {
    res.json({
      message: "Books retrieved successfully",
      total_books: booksByAuthor.length,
      books: booksByAuthor
    });
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books)
    .filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  
  if (booksByTitle.length > 0) {
    res.json({
      message: "Books retrieved successfully",
      total_books: booksByTitle.length,
      books: booksByTitle
    });
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json({
      message: "Reviews retrieved successfully",
      isbn: isbn,
      reviews: books[isbn].reviews
    });
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
