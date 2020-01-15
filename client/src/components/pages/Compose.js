import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardJS = require("keyboardJS");
const Soundfont = require("soundfont-player");

import Note from "../common/Note.js";
import Song from "../common/Song.js";

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
      keyMap: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77], // TODO: factor these out
      song: new Song("C", 120),
    };

    this.audioContext = new AudioContext();
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano').then((piano) => {
      this.piano = piano;
      console.log(this.piano);
    });

    this.addNote = this.addNote.bind(this);
    this.pressKey = this.pressKey.bind(this);
    this.noteBlock = this.noteBlock.bind(this); // TODO: factor out
  }

  addNote(pitch, onset, length) {
    this.setState({
      song: {
        notes: [...this.state.song.notes, new Note(pitch, onset, length)],
      },
    });
  }

  pressKey(key, note) {
    let newCurKey = Object.assign({}, this.state.curKey);
    newCurKey[key] = Date.now();
    this.setState({ curKey: newCurKey });
    this.piano.play(note);
  }

  componentDidMount() {
    for (let i = 0; i < this.state.keys.length; i++) {
      const key = this.state.keys[i];
      const note = this.state.keyMap[i];
      keyboardJS.bind(key, (e) => {
        e.preventRepeat();
        this.pressKey(key, note);
        console.log(key + " is pressed");
      }, (e) => {
        this.addNote(note, this.state.curKey[key] - this.state.start, Date.now() - this.state.curKey[key]);
        this.piano.play(note).stop();
        console.log(key + " is released"); // factor into addNote later(?)
      });
    }
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

  render() {
    return (
      <div className="Compose-container">
      compose page.
      
      {this.noteBlock()}
      </div>
    );
  }
}

export default Compose;
