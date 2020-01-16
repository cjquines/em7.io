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
      keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
      pitchMap: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77], // TODO: factor these out
      song: new Song("C", [4, 4], 120),
      isRecording: false,
      beatNumber: 0,
    };

    this.audioContext = new AudioContext();
    this.pressKey = this.pressKey.bind(this);
    this.releaseKey = this.releaseKey.bind(this);
    this.noteBlock = this.noteBlock.bind(this); // TODO: factor out
    this.record = this.record.bind(this);
  }

  auxiliaryMetronome(signature){
    this.metronome.play(34-4*+(this.state.beatNumber%signature[0]===0));
    this.setState({beatNumber: beatNumber+1});
  }

  playMetronome(tempo, signature){ //
    const delay = 60000/tempo;
    setInterval(auxiliaryMetronome(signature), delay);
  }

  pressKey(key, pitch) {
    this.piano.play(pitch);
    const newCurKey = {...this.state.curKey, [key]: Date.now()};
    this.setState({ curKey: newCurKey });
    console.log(key + " is pressed");
  }

  releaseKey(key, pitch) {
    this.piano.play(pitch).stop();
    const onset = this.state.curKey[key] - this.state.start;
    const length = Date.now() - this.state.curKey[key];
    const newNotes = [...this.state.song.notes, new Note(pitch, onset, length)];
    this.setState({ song: {...this.state.song, notes: newNotes} });
    console.log(key + " is released");
  }

  componentDidMount() {
    Soundfont.instrument(this.metronomeSound, 'woodblock') //
    .then((metronome) => this.metronome = metronome); //
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
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
    });
  }

  noteBlock() {
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
  }

  record() {

  }

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
      
      <button type="button" onClick={this.record}>Record</button>
      {this.noteBlock()}
      </div>
    );
  }
}

export default Compose;
