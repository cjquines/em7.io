import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardjs = require("keyboardjs");
const Soundfont = require("soundfont-player");

import Harmonize from "./Harmonize.js"; // TODO: REMOVE LATER

import KeyInput from "../modules/KeyInput.js";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import SignatureInput from "../modules/SignatureInput.js";
import SnapIntervalInput from "../modules/SnapIntervalInput.js";
import Song from "../common/Song.js";
import TempoInput from "../modules/TempoInput.js";

import "../../utilities.css";
import Piano from "../../public/piano.jpg";

/**
 * Compose is the page where we compose stuff.
 */
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: Date.now(),
      keys: ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";", "'"],
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], // TODO: factor these out
      originalSong: new Song("C", [4,4], 120),
      song: new Song("C", [4, 4], 120),
      isRecording: false,
      hasRecorded: false,
      isPlayingBack: false,
      snapInterval: 125, // in ms
      showHarmonize: false,
    };

    this.audioContext = new AudioContext();
    this.curKey = {};
    for (const key in this.state.keys) {
      this.curKey[key] = this.state.start;
    }
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
        keyboardjs.bind(key, (e) => {
          e.preventRepeat();
          this.pressKey(key, pitch);
        }, (e) => {
          this.releaseKey(key, pitch);
        });
      }
      keyboardjs.pause();
    });
  }

  auxMetronome = () => {
    if (this.beatNumber % this.state.song.signature[0] === 0) {
      this.metronome.play(66);
    } else {
      this.metronome.play(59);
    }
    this.setState({
      song: {...this.state.song, duration: this.state.song.duration+1}
    })
    
    this.beatNumber = this.beatNumber + 1;
  };

  playMetronome = () => { 
    const delay = 60000/this.state.song.tempo;
    this.beatNumber = 0;
    this.metronomeInterval = setInterval(this.auxMetronome, delay);
  };

  pressKey = (key, pitch) => {
    this.piano.play(pitch);
    this.curKey[key] = Date.now();
  };

  releaseKey = (key, pitch) => {
    this.piano.play(pitch).stop();
    const id = this.state.song.notes.length;
    const onset = this.curKey[key] - this.state.start;
    const length = Date.now() - this.curKey[key];
    const newNotes = [...this.state.song.notes, new Note(id, pitch, onset, length)];
    this.setState({ song: {...this.state.song, notes: newNotes} });
  };

  record = () => {
    this.setState({
      isRecording : true,
      start: Date.now(),
      song: {...this.state.song, notes: [], duration: 0}});
    this.playMetronome();
    keyboardjs.resume();
  };

  stopRecord = () => {
    this.setState({isRecording : false, originalSong : this.state.song, hasRecorded : true,
      song: {...this.state.song, duration: this.state.song.duration+1}});
    clearInterval(this.metronomeInterval);
    keyboardjs.pause();
  };

  snapNotes = () => {
    const snap = this.state.snapInterval;
    const newNotes = this.state.originalSong.notes.map((note) => {
      const newOnset = snap*Math.round(note.onset/snap);
      const newLength = snap*Math.max(1, Math.round(note.length/snap));
      return new Note(note.id, note.pitch, newOnset, newLength);
    });
    this.setState({ song: {...this.state.song, notes: newNotes} });
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
  };

  stop = () => {
    this.setState({isPlayingBack: false,});
    this.piano.stop();
  };

  render() {
    if (this.state.showHarmonize) {
      return (<Harmonize song={this.state.song} 
          onChange={(song) => this.setState({song: song})}/>);
    } else {
      return (
        <div className="Compose-container u-flexColumn">
        <div className = "u-flex-spaceBetween">
          <div className = "titles">
            <h2>Compose</h2>
            <h1>Untitled</h1>
          </div>
          
          <div className = "Timesig-block">
            <KeyInput className = "select-box"
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
              snapInterval={this.state.snapInterval}
              onChange={(song, snapInterval) => this.setState({song: song, snapInterval: snapInterval})}
            />
          </div>
        </div>

        <div className = "piano-row">
        <div className ="Record-button">
            {this.state.isRecording ? (
                <button type="button" className="startStop" onClick={this.stopRecord}>Stop</button>
            ) : (
                <button type="button" className="startStop" onClick={this.record}>Record</button>
                //maybe have a confirmation stating that recording again will overwrite previous song
            )}
          </div>
          <img src = {Piano} className = "piano-img"/>
        </div>

        <div className="playback-row">
        <div className="big-noteblock-container">
        <NoteBlock
          song={this.state.song}
          snapInterval={this.state.snapInterval}
          onChange={(song) => {this.setState({song: song}); this.render();}}
        />
        </div>
        </div>

        <div className="u-flex confirm-buttons-container">
        <SnapIntervalInput
          song={this.state.song}
          defaultValue="0.25"
          onChange={(snapInterval) => this.setState({snapInterval: snapInterval})}
        />
        { this.state.hasRecorded ? [(this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>play</button>)] : (null)
        }
          <button type="button" className="greyButton" onClick={this.snapNotes}>Snap notes!</button>
          <button type="button" className="greyButton" onClick={() => this.setState({showHarmonize: true})}>harmonize!</button>
        </div>
        </div>
      );
    }
  }
}

export default Compose;

