import React, { Component } from "react";
import { Link } from "@reach/router";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";
import { _ } from "core-js";
const Soundfont = require("soundfont-player");
import HarmonyInput from "../modules/HarmonyInput.js";

import "./Compose.css";
import SnapIntervalInput from "../modules/SnapIntervalInput"
import Dialogue from "../modules/Dialogue.js";

/**
 * Page where people can select harmonies.
 *
 * Proptypes
 * @param {Song} song: the song (TODO CHANGE SOON; UPLOAD AND DOWNLOAD FROM SERVER)
 * @param {(Song) => void} onChange: (function) changes song (ALSO NEEDS TO CHANGE SOON)
 */
class Harmonize extends Component {
  constructor(props) {
    super(props);
    this.state = {
    chordProgression : {},
    pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
    pitch: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    keyToChord : {},
    chordArray : {},
    harmony : {...this.props.song},
    isPlayingBack: false,
    saving: false,
    harmonyLineOne : {...this.props.song},
    harmonyLineTwo : {...this.props.song},
    harmonyLineThree : {...this.props.song},
    harmonyLineFour : {...this.props.song},
    harmonyOption : 1,
    isPlayingBack: false,
  };
  this.audioContext = new AudioContext();
  this.harmonyChords = [];
  this.changeChordMaps();
  }

  componentDidMount() {
    for(var x = 0; x < this.arrayA[0].length; x++){
      this.harmonizeHelper([[this.arrayA[0][x], 0]]);
    }
    this.harmonizeAlgorithm(this.state.harmonyOption);
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : 0.2})
    .then((piano) => {
      this.harmonyPiano = piano;
    });
  }

  harmonizeHelper = (curPath) => {
    let a = curPath[curPath.length - 1];
    let v = a[0];
    let i = a[1];
    if (i === this.arrayA.length - 1) {
      const revHarmonyChords = curPath.map((tup) => tup[0]);
      revHarmonyChords.reverse();
      this.harmonyChords.push(revHarmonyChords);
      return;
    }
    for (const u of this.arrayA[i+1]) {
      if (this.chordProgression[v].includes(u)) {
        this.harmonizeHelper(curPath.concat([[u, i+1]]));
      }
    }
  }

  harmonizeAlgorithm = (harmonyOption) => {
    //creates chord for each note in harmonyChords, want to create chords for only notes on important beat
    //TODO: create new array importantNotes
    //TODO: base arrayA on notes timing and note ID
    //TODO: also add more chords progressions and stuff
    //TODO: maybe try to find all possible paths instead of just one path?
    console.log(this.harmonyChords[harmonyOption-1]);
      const newNotesOne = this.state.harmonyLineOne.notes.map((note,i) => {
        const newPitch = this.chordToPitch[this.harmonyChords[harmonyOption-1][i]][0];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineOne : {...this.state.harmonyLineOne, notes : newNotesOne} });
      
      const newNotesTwo = this.state.harmonyLineTwo.notes.map((note,i) => {
        const newPitch = this.chordToPitch[this.harmonyChords[harmonyOption-1][i]][1];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineTwo : {...this.state.harmonyLineTwo, notes : newNotesTwo} });
      
      const newNotesThree = this.state.harmonyLineThree.notes.map((note,i) => {
        const newPitch = this.chordToPitch[this.harmonyChords[harmonyOption-1][i]][2];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineThree : {...this.state.harmonyLineThree, notes : newNotesThree} });

      const newNotesFour = this.state.harmonyLineFour.notes.map((note,i) => {
        const newPitch = this.chordToPitch[this.harmonyChords[harmonyOption-1][i]][3];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineFour : {...this.state.harmonyLineFour, notes : newNotesFour} });
       //TODO: account for inversions?
    }



  changeChordMaps = () => {
    const chordProgression = {}; 
    const keyToChord = {};
    const chordToPitch = {};
    chordProgression["I"] = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
    chordProgression["ii"] = ["ii", "V", "vii"];
    chordProgression["iii"] = ["iii", "vi"];
    chordProgression["IV"] = ["I", "ii", "IV", "V", "vii"];
    chordProgression["V"] = ["I", "V", "vi"];
    chordProgression["vi"] = ["ii", "IV", "vi"];
    chordProgression["vii"] = ["I","vii"];
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(this.props.song.key[0])];
    const supertonic = tonic + 2;
    const mediant = tonic + 5-this.props.song.key.length;
    const subdominant = tonic +5;
    const dominant = tonic + 7;
    const submediant = tonic + 10-this.props.song.key.length;
    const subtonic = tonic + 11;
    keyToChord[tonic % 12] = ["I",  "IV", "vi"];
    keyToChord[supertonic % 12] = ["ii",  "V",  "vii"];
    keyToChord[mediant % 12] = ["I", "iii", "vi"];
    keyToChord[subdominant % 12] = ["ii",  "IV",  "vii"];
    keyToChord[dominant % 12] = ["I", "iii", "V"];
    keyToChord[submediant % 12] = ["ii",  "IV", "vi" ];
    keyToChord[subtonic % 12] = ["iii", "V",  "vii" ];
    chordToPitch["I"] = [tonic, mediant, dominant];
    chordToPitch["ii"] = [supertonic, subdominant, submediant];
    chordToPitch["III"] = [mediant, dominant, subtonic];
    chordToPitch["IV"] = [subdominant, submediant, tonic];
    chordToPitch["V"] = [dominant, subtonic, supertonic];
    chordToPitch["vi"] = [submediant, tonic, mediant];
    chordToPitch["vii"] = [subtonic, supertonic, subdominant];
    this.chordToPitch = chordToPitch;
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
    this.arrayA = this.props.song.notes.map((note) => keyToChord[note.pitch % 12]);
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.props.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.harmonyLineOne.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.harmonyLineTwo.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.harmonyLineThree.notes.map((note) => {
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
  }
  
  closeDialogue = () => {
    this.setState({saving: false});
  }

  render() {
    return (
      <div className="Harmonize-container u-flexColumn">
      {this.state.tonic}
        <Dialogue id = "saveDialogue"
          closingFunction = {this.closeDialogue}
          display = {this.state.saving}
          title = {this.props.song.title}/>
        <div className = "u-flex-spaceBetween u-flexColumn">
          <div className = "titles">
            <h2>Harmonize</h2>
            <h1>{this.props.song.title}</h1>
          </div>

      
        <div className="big-noteblock-container">
        <NoteBlock
          song={this.props.song}
          onChange={this.props.onChange}
        />
        </div>
      </div>
      <div className="u-flex confirm-buttons-container">
        <div className="u-flex confirm-buttons-container">
          {(this.state.isPlayingBack
            ? <button type="button" className="greyButton" onClick={this.stop}>stop</button>
            : <button type="button" className="greyButton" onClick={this.play}>play</button>)}
        </div>
        { this.state.hasRecorded ? [(this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>play</button>)] : (null)
        }
          <button type="button" className="goodButton" onClick={this.openSaveDialogue}>save!</button>
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
