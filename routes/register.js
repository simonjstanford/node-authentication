const bcrypt = require("bcrypt");
var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");
const saltRounds = 10;

module.exports.goToRegister = (req, res) => {
    res.render("register");
}

module.exports.register = (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        persistence.registerUser(email, hash, () => res.render("secrets"))
    });
}