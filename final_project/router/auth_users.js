const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Username or password is missing" });
  }

  if (authenticatedUser(username, password)) {
    let token = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { token, username }
    return res.status(200).json({ message: "Successfully logged in", token });
  }
  return res.status(208).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (review) {
      book.reviews[username] = review
      return res.status(200).json({ message: `Review added for Book '${book.title}' successfully` });
    }
    return res.status(404).json({ message: "Review is missing" });

  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization.username;
  if (book && book.reviews && book.reviews.hasOwnProperty(username)) {
    delete book.reviews[username];
    return res.status(200).json({ message: `Review deleted for Book '${book.title}' successfully` });
  }
  return res.status(404).json(({ message: `Review not found for Book '${book.title}'` }));

}
);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
