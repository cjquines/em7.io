import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
import NoteBlock from "../modules/NoteBlock.js";
const Soundfont = require("soundfont-player");

import "../../utilities.css";

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
    this.audioContext = new AudioContext();
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

  saveSong = () => {
    get("/api/whoami").then((user) => {
      let body = { creator_id: user._id, name: this.state.song.title, content: this.state.song };
      post("/api/song", body).then((response) => {
        this.setState({ song: {...this.state.song, _id: response._id } });
      });
    });
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.song.harmony.map((note) => {
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
              //harmony={this.state.song.harmony}
              snapInterval={this.state.snapInterval}
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
