const bcrypt = require("bcrypt");
var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");

module.exports.gotToLogin = (req, res) => {
    res.render("login");
}

module.exports.verifyUser = function(username, password, cb) {
    persistence.getUserByEmail(username, function(user) {
        if (!user) { return cb(null, false); }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                return cb(null, user);
            } else {
                return cb(null, false);
            }
        });
  });
}