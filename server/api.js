/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Song = require("./models/songModel");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

/*
router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});
*/
router.post("/user", (req, res) => {
  const newUser = new User({
    _id: "123",
    name: "ok"
  });
  newUser.save().then((response) => res.send(response));
});

router.post("/song", (req, res) => {
  console.log(req.body)
  if (req.body.song_id) {
    console.log("in if")
    Song.updateOne({_id: req.body.song_id}, {content: req.body.content}).then((response) => res.send(response)).catch((err) => {console.log("ahh save")});
  } else {
    console.log("in else")
    const newSong = new Song({
      creator_id: req.body.creator_id,
      content: req.body.content,
      name: req.body.name,
    });
    newSong.save().then((response) => res.send(response)).catch((err)=> {console.log("holy last log")});
  }
  
});


// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/user", (req, res) => {
  User.find({_id: req.query.userId}).then((user) => {
    res.send(user[0]);
  });
});


router.get("/songs", (req, res) => {
  Song.find({creator_id : req.query.creator_id}).then((songs) => res.send(songs));
});

router.get("/song", (req,res) => {
  Song.find({_id: req.query._id}).then((song) => res.send(song[0]));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
