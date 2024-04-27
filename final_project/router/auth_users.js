const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const {expires} = require("express-session/session/cookie");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let usersWithSameName = users.filter(user => {
        return user.username === username;
    });
    return !(usersWithSameName.length > 0);
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter(user => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password) {
        return res.status(404).json({message:"Error logging in"});
    }
    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {accessToken, username};
        return res.status(200).send({message: "User successfully logged in."})
    } else {
        return res.status(208).send({message: "Invalid Login. Check username and password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    books[req.params.isbn]['reviews'][req.session.authorization.username] = req.query["review"];
    return res.status(200).json({
        message: "The review for the book with ISBN " + req.params.isbn + " has been added/updated."}
    );
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    delete books[req.params.isbn]['reviews'][req.session.authorization.username];
    return res.status(200).json({
        message: "The review for the book with ISBN " + req.params.isbn + "has been deleted."}
    );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
