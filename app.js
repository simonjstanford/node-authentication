require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.route("/")
    .get(routes.home.goToHome);

app.route("/login")
    .get(routes.login.gotToLogin)
    .post(routes.login.login);

app.route("/register")
    .get(routes.register.goToRegister)
    .post(routes.register.register);

app.listen(3000, function() {
    console.log("Server started on port 3000");
});


