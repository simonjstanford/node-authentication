var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");

module.exports.goToSubmit = (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
}

module.exports.submitSecret = (req, res) => { 
    if (req.isAuthenticated()) {
        const secret = req.body.secret;
        const userId = req.user.id;
        persistence.getUserById(userId, (user) => {
            if (user) {
                user.secret = secret;
                persistence.saveUser(user, () => res.redirect("/secrets"));
            }
        })
    } else {
        res.redirect("/login");
    }
}

module.exports.getAllSecrets = (req, res) => {
    persistence.getAllSecrets((secrets) => {
        if (secrets) {
            res.render("secrets", {secrets: secrets});
        }
    });
}