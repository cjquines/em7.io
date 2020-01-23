import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
const songModel = require("../../../../server/models/songModel");
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import SnapIntervalInput from "../modules/SnapIntervalInput";

import "../../utilities.css";
import Song from "../common/Song";
import { set } from "mongoose";

// TODO: this doesn't crash but play button doesnt work etc
// >> Cannot read property 'stop' of undefined
// another error is:
// >> Uncaught (in promise) TypeError: Cannot read property 'decodeAudioData' of undefined
// also i dont know if the updating function works, but i think rn composing and harmonizing page saves new copies every time?

/**
 * Listen is the page where we edit stuff.
 * @param songId
 */
class Listen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      song: undefined,
      snapInterval: 125,
      isPlayingBack: false,
    };
  }

  componentDidMount() {
    
    get("/api/song", { _id: this.props.songId }).then((song) => {
      song.content.notes.sort();
      this.setState({
        song: song.content,
      })
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : .3})
    .then((piano) => {
      this.harmonyPiano = piano;
    });
  }

  updateSong = () => {
    /**get("/api/whoami").then((user) => {
      let body = { creator_id: "guest", name: this.state.newSong.title, content: this.state.song };
      if (user._id) {
        body = { ...body, creator_id: user._id };
      }*/
    songModel.updateOne({ _id: this.props.songId }, { $set: {content: this.song} });
    //});
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.harmony.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
  };

  stop = () => {
    this.setState({isPlayingBack: false,});
    this.piano.stop();
    this.harmonyPiano.stop();
  };

  render() {
    if (this.state.song == undefined) {
      return (<div>loading...</div>)
    }
    return (
      <>
        <div className="playback-row">
          <div className="big-noteblock-container">
            <NoteBlock
              song={this.state.song}
              snapInterval={this.state.snapInterval}
              onChange={(song) => {this.setState({newSong: song}); this.render(); this.updateSong();}}
            />
          </div>
        </div>

        <div className="u-flex confirm-buttons-container">
          {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
          }
        </div>
      </>
    )
  }
}

export default Listen;
