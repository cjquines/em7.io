import React, { Component } from "react";
import { Link } from "@reach/router";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";
import { _ } from "core-js";
const Soundfont = require("soundfont-player");
import HarmonyInput from "../modules/HarmonyInput.js";

import "./Compose.css";
import SnapIntervalInput from "../modules/SnapIntervalInput";
import Dialogue from "../modules/Dialogue.js";
import { get, post } from "../../utilities.js";

/**
 * Page where people can select harmonies.
 *
 * Proptypes
 * @param {string} songId: the song ID
 */
class Harmonize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chordProgression : {},
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
      pitch: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
      keyToChord: {},
      chordArray: {},
      harmony: undefined,
      isProcessed: false,
      saving: false,
      isPlayingBack: false,
      song: undefined,
      loggedIn : false,
    };
    this.audioContext = new AudioContext();
    this.harmonyChords = [];
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        this.state.loggedIn = true;
      }
      console.log(this.state.loggedIn);
    });
    get("/api/song", { _id: this.props.songId }).then((song) => {
      song.content.notes.sort();
      //TODO: try/catch for melodies with no harmony (but for some reason this doesnt work idk)
      this.setState({
        harmony: {...song.content, notes: []},
        song: song.content,
      }, () => {
        let success = false;
        this.changeChordMaps();
        for (const note of this.chordChoices[0]) {
          if (this.harmonizeHelper([[note, 0]])) {
            success = true;
            break;
          }
        }
        if (!success) {
          console.log("no harmonies found!");
        } else {
          this.harmonizeAlgorithm(this.state.harmonyOption);
        }
        this.setState({isProcessed: true});
      });
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : 1})
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
      const song = {...this.state.song, harmony: this.state.harmony.notes};
      const body = { creator_id: user._id, name: this.state.song.title, content: song };
      post("/api/song", body).then((response) => {
        console.log(response);
        this.setState({ song: {...this.state.song, _id: response._id } });
      });
    });
  };

  harmonizePossibilities = (i) => {
    if (!this.chordChoices) return;
    let result = [];
    console.log(this.chordChoices);
    console.log(i);
    if (i === 0) {
      const w = this.harmonyChords[i+1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[u].includes(w)) {
          result.push(u);
        }
      }
    } else if (i === this.harmonyChords.length - 1) {
      const v = this.harmonyChords[i-1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[v].includes(u)) {
          result.push(u);
        }
      }
    } else {
      const v = this.harmonyChords[i-1];
      const w = this.harmonyChords[i+1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[v].includes(u) && this.chordProgression[u].includes(w)) {
          result.push(u);
        }
      }
    }
    console.log(result);
    return result;
  };

  harmonizeHelper = (curPath) => {
    const a = curPath[curPath.length - 1];
    const v = a[0];
    const i = a[1];
    if (i === this.chordChoices.length - 1) {
      const revHarmonyChords = curPath.map((tup) => tup[0]);
      this.harmonyChords = revHarmonyChords;
      return true;
    }
    for (const u of this.chordChoices[i+1]) {
      if (this.chordProgression[v].includes(u)) {
        if (this.harmonizeHelper(curPath.concat([[u, i+1]]))) {
          return true;
        }
      }
    }
    return false;
  };

  harmonizeAlgorithm = (harmonyOption) => {
    //TODO: base chordChoices on notes timing and not note ID to account for editing
    //TODO: also add more chords progressions and stuff
    //account for major/minor changes in the secondary harmony chords (only major is accounted for for now)
    //black key tonics dont work because string issues oops, will fix
    //mess around with the order of the arrays to give preference to some harmonies
    //choose paths that dont use V/V V/ii, etc. (create on harmonize algorithm that doesn't have 
    //secondary harmony chords, prioritize that over the one that does)
    console.log(this.harmonyChords);
    let harmony = [];
    for (let i = 0; i < this.state.song.notes.length; i++) {
      const note = this.state.song.notes[i];
      const chord = this.chordToPitch[this.harmonyChords[i]];
      for (let j = 0; j < chord.length; j++) {
        const newNote = new Note(4*i + j, chord[j], note.onset, note.length);
        harmony.push(newNote);
      }
    }
    this.setState({harmony: {...this.state.harmony, notes: harmony}});
  };

  changeChordMaps = () => {
    const chordProgression = {}; 
    const keyToChord = {};
    const chordToPitch = {};
    chordProgression["I"] = ["I", "ii", "iii", "IV", "V", "vi", "vii", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["ii"] = ["ii", "V", "vii", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["IV"] = ["I", "ii", "IV", "V", "vii", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["V"] = ["I", "V", "vi", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["V/V"] = ["V", "V/V"];
    chordProgression["V/ii"] = ["ii", "V/ii"];
    chordProgression["V/vi"] = ["vi", "V/vi"];
    chordProgression["V7/IV"] = ["IV", "V7/IV"];
    chordProgression["V/iii"] = ["iii", "V/iii"];
    chordProgression["vi"] = ["ii", "IV", "vi", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["vii"] = ["I", "vii", "V/V", "V/ii", "V/vi", "V7/IV", "iii","V/iii"];
    chordProgression["iii"] = ["iii", "vi"];
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(this.state.song.key[0])];
    const supertonic = tonic + 2;
    const mediant = tonic + 5-this.state.song.key.length;
    const subdominant = tonic +5;
    const dominant = tonic + 7;
    const submediant = tonic + 10-this.state.song.key.length;
     const subtonic = tonic + 12-this.state.song.key.length;
    //const subtonic = tonic + 11;
    keyToChord[tonic % 12] = ["I",  "IV", "vi"];
    keyToChord[(tonic+1) % 12] = ["V/ii"];
    keyToChord[supertonic % 12] = ["ii",  "V",  "vii", "V/V"];
    keyToChord[(supertonic+1) % 12] = ["V/iii"]
    keyToChord[mediant % 12] = ["I", "iii", "vi"];
    keyToChord[subdominant % 12] = [ "IV", "ii",  "vii"];
    keyToChord[(subdominant+1) % 12] = ["V/V"]
    keyToChord[dominant % 12] = ["I", "iii", "V"];
    keyToChord[(dominant+1) % 12] = ["V/vi"];
    keyToChord[submediant % 12] = ["ii", "IV", "vi", "V/V"];
    keyToChord[(subtonic-1) % 12] = ["V7/IV"];
    keyToChord[subtonic % 12] = [ "V",  "vii", "iii" ];
    chordToPitch["I"] = [tonic-12, mediant-12, dominant-12];
    chordToPitch["ii"] = [supertonic-12, subdominant-12, submediant-12];
    chordToPitch["IV"] = [subdominant-12, submediant-12, tonic-12];
    chordToPitch["V"] = [dominant-12, subtonic-24, supertonic-12];
    chordToPitch["vi"] = [submediant-24, tonic-12, mediant-12];
    chordToPitch["vii"] = [subtonic-24, supertonic-12, subdominant-12];
    chordToPitch["V/V"] = [supertonic-12, subdominant-11, submediant-12];
    chordToPitch["V/ii"] = [submediant-12, tonic-11, mediant-12];
    chordToPitch["V/vi"] = [mediant-12, dominant-11, subtonic-12];
    chordToPitch["V7/IV"] = [tonic-12, mediant-12, dominant-12, subtonic-13]; 
    chordToPitch["iii"] = [mediant-12, dominant-12, subtonic-12];
    chordToPitch["V/iii"] = [subtonic-12, supertonic-11, subdominant-11];
    this.chordToPitch = chordToPitch;
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
    this.chordChoices = this.state.song.notes.map((note) => keyToChord[note.pitch % 12]);
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

  openSaveDialogue = () => {
    this.setState({saving: true});
  };
  
  closeDialogue = () => {
    this.setState({saving: false});
  };

  render() {
    if (!this.state.isProcessed) {
      return <div>Loading...</div>;
    }
    if (!this.state.harmony) {
      return <div>
      No harmonies found! Your song is still saved, but we couldn't automatically find a harmony for you. Try clicking the Back button on your browser and changing the key of the song.
      </div>;
    }
    return (
    <div className="Harmonize-container u-flexColumn">
      <Dialogue id = "saveDialogue"
        closingFunction={this.closeDialogue}
        display={this.state.saving}
        title={this.state.song.title}
        saveFunction={this.saveSong}
        onChange={(title) => this.setState({song: {...this.state.song, title: title}})}
      />
      <div className = "u-flex-spaceBetween u-flexColumn">
        <div className = "titles">
          <h2>Harmonize</h2>
          <h1>{this.state.song.title}</h1>
        </div>
        <div className="big-noteblock-container">
          <NoteBlock
            harmony={this.state.harmony}
            song={this.state.song}
            harmonyChords={this.harmonyChords}
            onHarmonyChange={(index, value) => {this.harmonyChords[index] = value; this.harmonizeAlgorithm();}}
            possibilities={this.harmonizePossibilities}
          />
        </div>
      </div>
      <div className="u-flex confirm-buttons-container">
        {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
        }
        {this.state.loggedIn
          ? <button type="button" className="goodButton" onClick={this.openSaveDialogue}>Save</button>
          : <button type="button" className="goodButton" onClick={alert("Log in first!")} >Save</button>
        }
        <HarmonyInput
          harmonyOption={this.state.harmonyOption}
          harmonyChords = {this.harmonyChords.length}
          defaultHarmony="1"
          onChange={(harmonyOption) => {this.setState({harmonyOption : harmonyOption}), 
          this.harmonizeAlgorithm(harmonyOption)}}
        />
      </div>
    </div>
    );
  }
}

export default Harmonize;
