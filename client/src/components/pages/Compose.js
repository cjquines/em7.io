import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardJS = require("keyboardJS");
const Soundfont = require("soundfont-player");

import Harmonize from "./Harmonize.js"; // TODO: REMOVE LATER

import KeyInput from "../modules/KeyInput.js";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import SignatureInput from "../modules/SignatureInput.js";
import Song from "../common/Song.js";
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
      majorChordToKeyMap : {},
      keys: ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";", "'"],
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], // TODO: factor these out
      song: new Song("C", [4, 4], 120),
      isRecording: false,
      snapInterval: 125, // in ms
      showHarmonize: false,
    };

    this.audioContext = new AudioContext();
  }

  componentDidMount() {
    Soundfont.instrument(this.audioContext, 'woodblock')
    .then((metronome) => this.metronome = metronome);
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
      keyboardJS.pause();
    });
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
  };

  releaseKey = (key, pitch) => {
    this.piano.play(pitch).stop();
    const onset = this.state.curKey[key] - this.state.start;
    const length = Date.now() - this.state.curKey[key];
    const newNotes = [...this.state.song.notes, new Note(pitch, onset, length)];
    this.setState({ song: {...this.state.song, notes: newNotes} });
  };

  record = () => {
    this.setState({
      isRecording : true,
      start: Date.now(),
      song: {...this.state.song, notes: []},
    });
    this.playMetronome();
    keyboardJS.resume();
  };

  stopRecord = () => {
    this.setState({isRecording : false});
    clearInterval(this.metronomeInterval);
    keyboardJS.pause();
  };

  snapNotes = () => {
    const snap = this.state.snapInterval;
    const newNotes = this.state.song.notes.map((note) => {
      const newOnset = snap*Math.round(note.onset/snap);
      const newLength = snap*Math.max(1, Math.round(note.length/snap));
      return new Note(note.pitch, newOnset, newLength);
    });
    this.setState({ song: {...this.state.song, notes: newNotes} });
  }



  render() {
    if (this.state.showHarmonize) {
      return (<Harmonize song={this.state.song}/>);
    } else {
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
        
        {this.state.isRecording ? (
            <button type="button" onClick={this.stopRecord}>Stop</button>
        ) : (
            <button type="button" onClick={this.record}>Record</button>
        )}

        <button type="button" onClick={this.snapNotes}>Snap notes!</button>
        <button type="button" onClick={() => this.setState({showHarmonize: true})}>harmonize!</button>

        <NoteBlock
          song={this.state.song}
          onChange={(song) => this.setState({song: song})}
        />
        </div>
      );
    }
  }
}

export default Compose;
