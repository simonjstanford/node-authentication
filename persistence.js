const mongoose = require("mongoose");
const url = process.env.DB_CONNECTION;

var Schema = mongoose.Schema;

const userSchema = {
  email: String,
  password: String
}

const User = new mongoose.model("User", userSchema);

exports.registerUser = function(email, password, callback) {
  const newUser = new User({email: email, password: password});
  openConnection();
  newUser.save((err) => {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close(() => callback(items));
  });
};

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
