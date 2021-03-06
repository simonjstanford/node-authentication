require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes');
const persistence = require("./persistence.js");

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    persistence.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

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
    .get(routes.secrets.getAllSecrets);

app.route("/submit")
    .get(routes.secrets.goToSubmit)
    .post(routes.secrets.submitSecret);
    
app.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
