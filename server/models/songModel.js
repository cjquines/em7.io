const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: String,
  creator_id: String,
  content: Object,
  key: String,
});

// compile model from schema
module.exports = mongoose.model("song", SongSchema);
