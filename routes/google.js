var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");
const passport = require('passport');


//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
module.exports.authenticate = (req, res) => {
    passport.authenticate("google", { scope: ["profile"] });
}