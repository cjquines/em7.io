import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardJS = require("keyboardJS");
const Soundfont = require("soundfont-player");

import Note from "../common/Note.js";
import Song from "../common/Song.js";
import SongParameterInput from "../modules/SongParameterInput.js";

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
    this.auxiliaryMetronome = this.auxiliaryMetronome.bind(this);
    this.playMetronome = this.playMetronome.bind(this);
  }

  auxiliaryMetronome(){
    if(this.state.beatNumber%this.state.song.signature[0]===0){
      this.metronome.play(64);
    }
    else{
      this.metronome.play(60);
    }
    //this.metronome.play(34-4*+(this.state.beatNumber%this.state.song.signature[0]===0));
    this.setState({beatNumber: this.state.beatNumber+1});
  }

  playMetronome(){ //
    const delay = 60000/this.state.song.tempo;
    setInterval(this.auxiliaryMetronome, delay);
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
    Soundfont.instrument(this.audioContext, 'woodblock') //
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

      <SongParameterInput
        song={this.state.song}
        parameter="key"
        text="Key"
        defaultValue="C"
        onChange={(song) => this.setState({song: song})}
      />
      <SongParameterInput
        song={this.state.song}
        parameter="signature"
        text="Time Signature"
        defaultValue="4/4"
        onChange={(song) => this.setState({song: song})}
      />
      <SongParameterInput
        song={this.state.song}
        parameter="tempo"
        text="tempo"
        defaultValue="120"
        onChange={(song) => this.setState({song: song})}
      />
      
      <button type="button" onClick={this.playMetronome}>Record</button>
      {this.noteBlock()}
      </div>
    );
  }
}

export default Compose;
