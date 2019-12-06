require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const persistence = require("./persistence.js");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.route("/")
    .get((req, res) => {
        res.render("home");
    });

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const email = req.body.username;
        const password = req.body.password;
        const hash = md5(password);
        persistence.getUser(email, (user) => 
        {
            if (user && user.password === hash) {
                res.render("secrets")
            } else {
                res.sendStatus(401);
            }
        })
    });

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        const email = req.body.username;
        const password = req.body.password;
        const hash = md5(password);
        persistence.registerUser(email, hash, () => res.render("secrets"))
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});