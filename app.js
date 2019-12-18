require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes');
const persistence = require("./persistence.js");

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(routes.login.verifyUser));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => cb(null, user.id));
  
passport.deserializeUser((id, cb) => {
    persistence.getUserById(id, function (user) {
      cb(null, user);
    });
  });


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.route("/")
    .get(routes.home.goToHome);

app.route("/login")
    .get(routes.login.gotToLogin)
    .post(passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => res.redirect("/secrets"));

app.route("/register")
    .get(routes.register.goToRegister)
    .post(routes.register.register);

app.route("/secrets")
    .get(require('connect-ensure-login').ensureLoggedIn(), (req, res) => res.render('secrets', { user: req.user }));

    
app.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
