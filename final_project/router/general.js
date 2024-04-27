const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(404).json({message:"User already exists!"});
        }
    } else {
        return res.status(404).json({message:"Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let reqPrm = new Promise((resolve, reject) => {
        resolve(res.send({"books": books}));
    });
    reqPrm.then((response) => {
        return response;
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let reqPrm = new Promise((resolve, reject) => {
        resolve(res.send(books[req.params.isbn]));
    });
    reqPrm.then((response) => {
        return response;
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let reqPrm = new Promise((resolve, reject) => {
        resolve(res.send({"booksbyauthor": Object.values(books).filter(book => book.author === req.params.author)}));
    });
    reqPrm.then((response) => {
        return response;
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let reqPrm = new Promise((resolve, reject) => {
        resolve(res.send({"booksbytitle": Object.values(books).filter(book => book.title === req.params.title)}));
    });
    reqPrm.then((response) => {
        return response;
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let reqPrm = new Promise((resolve, reject) => {
        res.send(books[req.params.isbn]['reviews']);
    });
    reqPrm.then((response) => {
        return response;
    });
});

module.exports.general = public_users;
