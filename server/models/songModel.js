import Song from "../../client/src/components/common/Song.js"

const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: String,
  creator_id: String,
  _id: String,
  content: Song,
});

// compile model from schema
module.exports = mongoose.model("song", SongSchema);
