const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return username && typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

// Get user's reviews
regd_users.get("/reviews", (req, res) => {
  const username = req.user.username;
  const userReviews = [];
  
  // Collect all reviews by the user from all books
  Object.entries(books).forEach(([isbn, book]) => {
    const review = book.reviews[username];
    if (review) {
      userReviews.push({
        _id: isbn + '-' + username, // Create a unique ID
        book: {
          _id: isbn,
          title: book.title,
          author: book.author
        },
        rating: review.rating || 0,
        comment: review.text,
        createdAt: review.date || new Date().toISOString()
      });
    }
  });

  res.json(userReviews);
});

// Logout user
regd_users.post("/logout", (req, res) => {
  // Since we're using JWT tokens, we don't need to maintain session state
  // The frontend will handle removing the token from localStorage
  return res.status(200).json({message: "Logged out successfully"});
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!review || !review.comment) {
    return res.status(400).json({message: "Review comment is required"});
  }

  const reviewData = {
    comment: review.comment,
    rating: review.rating || 5,
    user: username,
    date: new Date().toISOString().split('T')[0]
  };

  books[isbn].reviews[username] = reviewData;
  return res.status(200).json({
    message: "Review added/modified successfully",
    review: reviewData
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found"});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
