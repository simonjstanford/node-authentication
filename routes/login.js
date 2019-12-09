const bcrypt = require("bcrypt");
var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");

module.exports.gotToLogin = (req, res) => {
    res.render("login");
}

module.exports.login = (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
  
    persistence.getUser(email, (user) => {
        if (user) {
            compareHash(password, user.password, res);
        } else {
            res.sendStatus(401);
        }     
    });    
}

function compareHash(passwordToCheck, hashedPassword, res) {
    bcrypt.compare(passwordToCheck, hashedPassword, (err, isMatch) => {
        if (isMatch) {
            res.render("secrets");
        } else {
            res.sendStatus(401);
        }
    });
}