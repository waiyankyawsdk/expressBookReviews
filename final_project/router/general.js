const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookData) => {
      return res.send(JSON.stringify(bookData, null, 4));
    })
    .catch(error => {
      console.error("Error:", error);
      return res.status(500).send("Internal Server Error");
    })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    resolve(books[isbn]);
  })
    .then((bookData) => {
      if (bookData)
        return res.send(JSON.stringify(bookData, null, 4));
      return res.status(404).json({ message: "Book not found" });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  new Promise((resolve, reject) => {
    resolve(Object.values(books).filter(book => book.author === author))
  })
    .then((books_by_author) => {
      if (books_by_author.length > 0)
        return res.send(JSON.stringify(books_by_author, null, 4));
      return res.status(404).json({ message: "Book not found" });
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  new Promise((resolve, reject) =>
    resolve(Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase())))
  )
    .then((books_by_title) => {
      if (books_by_title)
        return res.send(JSON.stringify(books_by_title, null, 4))
      return res.status(404).json({ message: "Book not found" });
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const review_isbn = req.params.isbn;
  if (books[review_isbn].reviews)
    return res.send(JSON.stringify(books[review_isbn].reviews, null, 4));
  return res.status(400).json({ message: "Book not found" });
});

module.exports.general = public_users;
