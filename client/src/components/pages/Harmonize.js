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
      saving: false,
      harmonyOption: 1,
      isPlayingBack: false,
      song: undefined,
    };
    this.audioContext = new AudioContext();
    this.harmonyChords = [];
  }

  componentDidMount() {
    get("/api/song", { _id: this.props.songId }).then((song) => {
      song.content.notes.sort();
      //TODO: try/catch for melodies with no harmony (but for some reason this doesnt work idk)
      try{
        this.setState({
          harmony: {...song.content, notes: []},
          song: song.content,
        }, () => {
          this.changeChordMaps();
          for (const note of this.chordChoices[0]) {
            this.harmonizeHelper([[note, 0]]);
          }
          this.harmonizeAlgorithm(this.state.harmonyOption);
        });
      }
      catch(err) {
        console.log("oops");
      }
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
    this.setState ({
      song: {...this.state.song, harmony: this.state.harmony.notes}
    })
    get("/api/whoami").then((user) => {
      let body = { creator_id: user._id, name: this.state.song.title, content: this.state.song };
      post("/api/song", body).then((response) => {
        console.log(response);
        this.setState({ song: {...this.state.song, _id: response._id } });
      });
    });
  };

  harmonizeHelper = (curPath) => {
    let a = curPath[curPath.length - 1];
    let v = a[0];
    let i = a[1];
    if (i === this.chordChoices.length - 1) {
      const revHarmonyChords = curPath.map((tup) => tup[0]);
      this.harmonyChords.push(revHarmonyChords);
      return;
    }
    for (const u of this.chordChoices[i+1]) {
      if (this.chordProgression[v].includes(u)) {
        this.harmonizeHelper(curPath.concat([[u, i+1]]));
      }
    }
  };

  harmonizeAlgorithm = (harmonyOption) => {
    //TODO: base chordChoices on notes timing and not note ID to account for editing
    //TODO: also add more chords progressions and stuff
    //account for major/minor changes in the secondary harmony chords (only major is accounted for for now)
    console.log(this.harmonyChords[harmonyOption-1]);
    let harmony = [];
    for (let i = 0; i < this.state.song.notes.length; i++) {
      const note = this.state.song.notes[i];
      const chord = this.chordToPitch[this.harmonyChords[harmonyOption-1][i]];
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
    chordProgression["I"] = ["I", "ii", "iii", "IV", "V", "vi", "vii", "V/V", "V/ii"];
    chordProgression["ii"] = ["ii", "V", "vii", "V/V", "V/ii"];
    chordProgression["IV"] = ["I", "ii", "IV", "V", "vii", "V/V", "V/ii"];
    chordProgression["V"] = ["I", "V", "vi", "V/V", "V/ii"];
    chordProgression["V/V"] = ["V", "V/V"];
    chordProgression["V/ii"] = ["ii", "V/ii"];
    chordProgression["V/vi"] = ["vi", "V/vi"];
    chordProgression["vi"] = ["ii", "IV", "vi", "V/V", "V/ii"];
    chordProgression["vii"] = ["I","vii", "V/V", "V/ii"];
    chordProgression["iii"] = ["iii", "vi"];
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(this.state.song.key[0])];
    const supertonic = tonic + 2;
    const mediant = tonic + 5-this.state.song.key.length;
    const subdominant = tonic +5;
    const dominant = tonic + 7;
    const submediant = tonic + 10-this.state.song.key.length;
    // const subtonic = tonic + 12-this.state.song.key.length; natural minor
    const subtonic = tonic + 11;
    keyToChord[tonic % 12] = ["I",  "IV", "vi"];
    keyToChord[(tonic+1) % 12] = ["V/ii"];
    keyToChord[supertonic % 12] = ["ii",  "V",  "vii", "V/V"];
    keyToChord[mediant % 12] = ["I", "iii", "vi", "V/ii"];
    keyToChord[subdominant % 12] = ["ii",  "IV",  "vii"];
    keyToChord[(subdominant+1) % 12] = ["V/V"]
    keyToChord[dominant % 12] = ["I", "iii", "V"];
    keyToChord[(dominant+1) % 12] = ["V/vi"];
    keyToChord[submediant % 12] = ["ii",  "IV", "vi", "V/V", "V/ii" ];
    keyToChord[subtonic % 12] = [ "V",  "vii", "iii" ];
    chordToPitch["I"] = [tonic-12, mediant-12, dominant-12];
    chordToPitch["ii"] = [supertonic-12, subdominant-12, submediant-12];
    chordToPitch["IV"] = [subdominant-12, submediant-12, tonic-12];
    chordToPitch["V"] = [dominant-24, subtonic-24, supertonic-12];
    chordToPitch["vi"] = [submediant-24, tonic-12, mediant-12];
    chordToPitch["vii"] = [subtonic-24, supertonic-12, subdominant-12];
    chordToPitch["V/V"] = [supertonic-12, subdominant-11, submediant-12];
    chordToPitch["V/ii"] = [submediant-24, tonic-11, mediant-12];
    chordToPitch["V/vi"] = [mediant-12, dominant-11, subtonic-12];
    chordToPitch["iii"] = [mediant-12, dominant-12, subtonic-12];
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
    if (this.state.song && this.state.harmony){
      console.log(this.state.song)
      console.log(this.state.harmony)
    }
      
    if (!this.state.song) {
      return <div>Loading...</div>;
    }
    let loggedIn = false;
    get("/api/whoami").then((user) => {
      if (user) {
        loggedIn = true;
      }
    });

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
          />
        </div>
      </div>
      <div className="u-flex confirm-buttons-container">
        {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
        }
        {loggedIn
          ? <button type="button" className="greyButton" onClick={alert("Log in first!")}>Save</button>
          : <button type="button" className="goodButton" onClick={this.openSaveDialogue}>Save</button>
        }
        <HarmonyInput
          harmonyOption={this.state.harmonyOption}
          harmonyChords = {this.harmonyChords.length}
          defaultHarmony="1"
          onChange={(harmonyOption) => {this.setState({harmonyOption : harmonyOption}), 
          this.harmonizeAlgorithm(harmonyOption)}}
        />
      </div>
      <div>
      {this.state.harmony
        ? ""
        : "No harmony detected"
      }
      </div>
    </div>
    );
  }
}

export default Harmonize;
