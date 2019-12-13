const mongoose = require("mongoose");

const url = process.env.DB_CONNECTION;
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

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

exports.findOrCreate = function(email, callback) {
  openConnection();
  User.findOne({email: email}, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      mongoose.connection.close(() => callback(user));
    } else {
      const newUser = new User({email: email});
      newUser.save((err) => {
        if (err) {
          console.log(err);
        }
        mongoose.connection.close(() => callback(newUser));
      });
    }
  });
}

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
