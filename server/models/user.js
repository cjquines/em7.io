const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  _id: String,
});

// compile model from schema
module.exports = mongoose.model("User", UserSchema);
