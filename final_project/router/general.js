const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new customer
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "Customer already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register customer. Username and password required." });
});

// Task 1 & Task 10: Get the book list available in the shop using Promises / async-await
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bks) => res.status(200).send(JSON.stringify(bks, null, 4)))
        .catch((err) => res.status(500).json({ message: "Error retrieving books", error: err }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promises / async-await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Promises / async-await
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push({ isbn: key, ...books[key] });
            }
        }
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found by author ${author}` });
        }
    });

    getBooksByAuthor
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promises / async-await
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push({ isbn: key, ...books[key] });
            }
        }
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found with title ${title}` });
        }
    });

    getBooksByTitle
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// =========================================================================
// Functions demonstrating Axios with async/await and Promises (Tasks 10-13)
// =========================================================================

// Task 10: Get all books using Axios with async/await
const getAllBooksAsync = async (url = 'http://localhost:5000/') => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 11: Get book details based on ISBN using Axios with async/await
const getBookByISBNAsync = async (isbn, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 12: Get book details based on Author using Axios with async/await
const getBooksByAuthorAsync = async (author, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 13: Get book details based on Title using Axios with async/await
const getBooksByTitleAsync = async (title, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
