import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardjs = require("keyboardjs");
const Soundfont = require("soundfont-player");

import KeyInput from "../modules/KeyInput.js";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import SignatureInput from "../modules/SignatureInput.js";
import SnapIntervalInput from "../modules/SnapIntervalInput.js";
import Song from "../common/Song.js";
import TempoInput from "../modules/TempoInput.js";

import "../../utilities.css";
import "./Compose.css"
import Piano from "../modules/Piano.js";
import { get, post } from "../../utilities.js";



/**
 * Compose is the page where we compose stuff.
 */
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: Date.now(),
      keys: ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";"],
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76],
      pressed: {},
      originalSong: new Song("C", [4,4], 120),
      song: new Song("C", [4, 4], 120),
      isLoaded: false,
      isRecording: false,
      hasRecorded: false,
      isPlayingBack: false,
      snapInterval: 125, // in ms
      showHarmonize: false,
      hasSnapped: false,
    };
    this.audioContext = new AudioContext();
    this.curKey = {};
    for (const key in this.state.keys) {
      this.curKey[key] = this.state.start;
    }
  }

  componentDidMount() {
    if (this.props.songId) {
      this.setState({
        hasRecorded: true,
      })
      get("/api/song", { _id: this.props.songId }).then((song) => {
        this.setState({
          originalSong: song.content,
          song: {...song.content, _id: this.props.songId }
        });
      });
    }
    Soundfont.instrument(this.audioContext, 'woodblock')
    .then((metronome) => this.metronome = metronome);
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
      this.updateKeyBindings();
      this.setState({isLoaded: true});
    });
  };

  updateKeyBindings = () => {
    keyboardjs.reset();
    let newPressed = {};
    for (let i = 0; i < this.state.keys.length; i++) {
      const key = this.state.keys[i];
      const pitch = this.state.pitchMap[i];
      keyboardjs.bind(key, (e) => {
        e.preventRepeat();
        this.pressKey(key, pitch);
      }, (e) => {
        this.releaseKey(key, pitch);
      });
      newPressed[key] = false;
    }
    this.setState({pressed: newPressed});
    keyboardjs.bind("[", (e) => {
      e.preventRepeat();
      if (this.state.pitchMap[0] !== 48) {
        this.setState({pitchMap : this.state.pitchMap.map((note) => note - 12)}, () => {
          console.log(this.state.pitchMap);
          this.updateKeyBindings();
        });
      }
    });
    keyboardjs.bind("]", (e) => {
      e.preventRepeat();
      if (this.state.pitchMap[0] !== 72) {
        this.setState({pitchMap : this.state.pitchMap.map((note) => note + 12)}, () => {
          console.log(this.state.pitchMap);
          this.updateKeyBindings();
        });
      }
    });
    if (!this.state.isRecording) {
      keyboardjs.pause();
    }
  };

  handleTitleChange = (event) => {
    this.setState({ song: {...this.state.song, title: event.target.value} });
  };

  saveSong = () => {
    get("/api/whoami").then((user) => {
      let body = { creator_id: "guest", name: this.state.song.title, content: this.state.song, key: this.state.song.key };
      if (user._id) {
        body = { ...body, creator_id: user._id };
      }
      if (this.state.song._id) {
        body = { ...body, song_id: this.state.song._id };
      }
      post("/api/song", body).then((response) => {
          console.log(response);
          if (response._id) {
            this.setState({ song: {...this.state.song, _id: response._id } });
          }
      });
    });
    console.log(this.state.song._id)
    console.log("saving from compose page")
    // get("/api/song", { _id: this.props.songId }).then((song) => console.log("funny song", song)).catch((err) => {console.log("err")});
  };

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
    return "ok"
  };

  playMetronome = () => { 
    this.metronome.play(66);
    this.setState({
      song: {...this.state.song, notes: [], duration: 1}
    })
    const delay = 60000/this.state.song.tempo;
    this.beatNumber = 1;
    this.metronomeInterval = setInterval(this.auxMetronome, delay);
  };

  pressKey = (key, pitch) => {
    this.setState({pressed: {...this.state.pressed, [key]: true}});
    this.piano.play(pitch);
    this.curKey[key] = Date.now();
  };

  releaseKey = (key, pitch) => {
    this.setState({pressed: {...this.state.pressed, [key]: false}});
    this.piano.play(pitch).stop();
    const id = this.state.song.notes.length;
    const onset = this.curKey[key] - this.state.start;
    const length = Date.now() - this.curKey[key];
    const newNotes = [...this.state.song.notes, new Note(id, pitch, onset, length)];
    this.setState({ song: {...this.state.song, notes: newNotes} });
  };
  
  //TODO: add max length?
  record = () => {
    this.setState({isRecording : true, start: Date.now()});
    this.playMetronome();
    keyboardjs.resume();
    this.setState({hasSnapped: false});
  };

  stopRecord = () => {
    this.setState({isRecording : false, originalSong : this.state.song, hasRecorded : true,
      song: {...this.state.song, duration: this.state.song.duration+1}});
    clearInterval(this.metronomeInterval);
    keyboardjs.pause();
    //this.saveSong();
  };

  //TODO: snap correctly after changing tempo
  snapNotes = () => {
    const snap = this.state.snapInterval;
    const newNotes = this.state.originalSong.notes.map((note) => {
      const newOnset = snap*Math.round(note.onset/snap);
      const newLength = snap*Math.max(1, Math.round(note.length/snap));
      return new Note(note.id, note.pitch, newOnset, newLength);
    });
    this.setState({ song: {...this.state.song, notes: newNotes}, hasSnapped: true});
    //this.saveSong();
  };

  play = () => {
    this.setState({isPlayingBack: true});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    const duration = Math.max(...this.state.song.notes.map((notes) => notes.onset+notes.length));
    this.timeout = setTimeout(this.stop, duration);
  };



  stop = () => {
    this.setState({isPlayingBack: false});
    clearTimeout(this.timeout)
    this.piano.stop();
  };

  componentWillUnmount() {
    clearTimeout(this.timeout)
    this.piano.stop();
  };

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    }
    let recordButton = (<button type="button" className="startRound" onClick={this.record}>Record</button>);
    if (this.state.isRecording) {
      recordButton = (<button type="button" className="stopRound" onClick={this.stopRecord}>Stop</button>);
    }
    let playButton = (null);
    if (this.state.hasRecorded) {
      playButton = (this.state.isPlayingBack
        ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
        : <button type="button" className="greyButton" onClick={this.play}>Play</button>);
    }
    let harmonizeButton = (<button type="button" className="greyButton">Harmonize</button>);
    if (this.state.song.notes.length !== 0 && !this.state.isRecording && !this.state.isPlayingBack) {
      harmonizeButton = (<Link to={`/harmonize/${this.state.song._id}`}><button type="button" className="goodButton" onClick={this.saveSong()}>Harmonize</button></Link>);
    }
    let defaultTonic = this.state.song.key;
    let defaultMode = "";
    if (this.state.song.key.slice(-1) === "m") {
      defaultTonic = this.state.song.key.slice(0, -1);
      defaultMode = this.state.song.key.slice(-1);
    }
    return (
    <div className="Compose-container u-flexColumn">
      <div className="u-flex-spaceBetween">
        <div className = "titles">
          <h2>Compose</h2>
          <input id="song-title" value={this.state.song.title} type = "text" onChange={this.handleTitleChange}></input>
        </div>
        <div className = "Timesig-block">
          <KeyInput className = "select-box"
            song={this.state.song}
            defaultTonic={defaultTonic}
            defaultMode={defaultMode}
            onChange={(song) => this.setState({song: song})}
          />
          <SignatureInput
            song={this.state.song}
            defaultUpper={this.state.song.signature[0]}
            defaultLower={this.state.song.signature[1]}
            onChange={(song) => this.setState({song: song})}
          />
          <TempoInput
            song={this.state.song}
            defaultTempo={this.state.song.tempo}
            snapInterval={this.state.snapInterval}
            onChange={(song, snapInterval) => this.setState({song: song, snapInterval: snapInterval, hasSnapped: false})}
          />
        </div>
      </div>

      <div className="piano-row">
        <div className="Record-button">{recordButton}</div>
        <Piano keys={this.state.keys} notes={this.state.pitchMap} pressed={this.state.pressed}/>
      </div>

      <div className="playback-row">
        <div className="big-noteblock-container">
          <NoteBlock
            song={this.state.song}
            snapInterval={this.state.snapInterval}
            onChange={(song) => {this.setState({song: song}); this.render(); }}
          />
        </div>
      </div>

      {this.state.hasRecorded ? (
      <div className="u-flex confirm-buttons-container u-flex-spaceBetween">
        <SnapIntervalInput
          song={this.state.song}
          defaultValue="0.25"
          onChange={(snapInterval) => this.setState({snapInterval: snapInterval})}
        />
        {playButton}
        <button type="button" className="hollowButton" onClick={this.snapNotes}>Snap notes</button>
        {harmonizeButton}
      </div>) : (null)}
    </div>
    );
  }
}

export default Compose;

