const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const url = process.env.DB_CONNECTION;
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  secret: String
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

exports.registerUser = function(email, password, callback) {
  const newUser = new User({email: email, password: password});
  openConnection();
  newUser.save((err) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback());
  });
};

exports.getUserByEmail = function(email, callback) {
  openConnection();
  User.findOne({email: email}, (err, user) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback(user));
  });
};

exports.getUserById = function(id, callback) {
  openConnection();
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback(user));
  });
};

exports.saveUser = function(user, callback) {
  openConnection();
  user.save((err) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback());
  });
};

exports.findOrCreate = function(id, callback) {
  openConnection();
  User.findOrCreate({ googleId: id }, function (err, user) {
    console.log(err);
    mongoose.connection.close(() => callback(err, user));
  });
}

exports.getAllSecrets = (callback) => {
  openConnection();
  User.find({"secret": {$ne: null}}, (err, users) => {
    if (err) {
      console.log(err);
      mongoose.connection.close(() => callback());
    }
    else if (users) {
      const secrets = users.map(u => u.secret);
      mongoose.connection.close(() => callback(secrets));
    }
  });
}

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
