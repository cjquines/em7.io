const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: String,
  creator_id: String,
  content: Object,
});

// compile model from schema
module.exports = mongoose.model("song", SongSchema);
