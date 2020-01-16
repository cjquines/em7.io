import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardJS = require("keyboardJS");
const Soundfont = require("soundfont-player");

import Note from "../common/Note.js";
import Song from "../common/Song.js";
import KeyInput from "../modules/KeyInput.js";
import SignatureInput from "../modules/SignatureInput.js";
import TempoInput from "../modules/TempoInput.js";

import "../../utilities.css";

/**
 * Compose is the page where we compose stuff.
 */
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: Date.now(),
      curKey: null,
      keys: ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";", "'"],
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], // TODO: factor these out
      song: new Song("C", [4, 4], 120),
      isRecording: false,
    };

    this.audioContext = new AudioContext();
  }

  componentDidMount() {
    Soundfont.instrument(this.audioContext, 'woodblock')
    .then((metronome) => this.metronome = metronome);
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => this.piano = piano);
  }

  auxMetronome = () => {
    if (this.beatNumber % this.state.song.signature[0] === 0) {
      this.metronome.play(66);
    } else {
      this.metronome.play(59);
    }
    this.beatNumber = this.beatNumber + 1;
  };

  playMetronome = () => { 
    const delay = 60000/this.state.song.tempo;
    this.beatNumber = 0;
    this.metronomeInterval = setInterval(this.auxMetronome, delay);
  };

  pressKey = (key, pitch) => {
    this.piano.play(pitch);
    const newCurKey = {...this.state.curKey, [key]: Date.now()};
    this.setState({ curKey: newCurKey });
    console.log(key + " is pressed");
  };

  releaseKey = (key, pitch) => {
    this.piano.play(pitch).stop();
    const onset = this.state.curKey[key] - this.state.start;
    const length = Date.now() - this.state.curKey[key];
    const newNotes = [...this.state.song.notes, new Note(pitch, onset, length)];
    this.setState({ song: {...this.state.song, notes: newNotes} });
    console.log(key + " is released");
  };

  // TODO factor out
  noteBlock = () => {
    return this.state.song.notes.map((note, index) => (
      <div key={index}
      style={{
        position: "absolute",
        top: (note.pitch - 50)*20 + "px",
        width: (note.length / 20) + "px",
        left: (note.onset / 20) + "px",
        height: "20px",
        background: "#000",
      }}/>
    ));
  };

  record = () => {
    this.isRecording = true;
    this.playMetronome();
    for (let i = 0; i < this.state.keys.length; i++) {
      const key = this.state.keys[i];
      const pitch = this.state.pitchMap[i];
      keyboardJS.bind(key, (e) => {
        e.preventRepeat();
        this.pressKey(key, pitch);
      }, (e) => {
        this.releaseKey(key, pitch);
      });
    }
  };

  stopRecord = () => {
    this.isRecording = false;
    clearInterval(this.metronomeInterval);
  };

  render() {
    return (
      <div className="Compose-container">
      compose page.

      <KeyInput
        song={this.state.song}
        defaultTonic="C"
        defaultMode=""
        onChange={(song) => this.setState({song: song})}
      />
      <SignatureInput
        song={this.state.song}
        defaultUpper="4"
        defaultLower="4"
        onChange={(song) => this.setState({song: song})}
      />
      <TempoInput
        song={this.state.song}
        defaultTempo="120"
        onChange={(song) => this.setState({song: song})}
      />
      
      {this.isRecording ? (
          <button type="button" onClick={this.stopRecord}>Stop</button>
      ) : (
          <button type="button" onClick={this.record}>Record</button>
      )}

      {this.noteBlock()}
      </div>
    );
  }
}

export default Compose;
