const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const url = process.env.DB_CONNECTION;
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"]
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

exports.getUser = function(email, callback) {
  openConnection();
  User.findOne({email: email}, (err, user) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback(user));
  });
};

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
