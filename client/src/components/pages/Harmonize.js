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
    harmonyChords : [],
    isPlayingBack: false
  };
  this.audioContext = new AudioContext();
  }

  componentDidMount() { 
    this.changeChordMaps();
    this.harmonizeAlgorithm(this.state.harmonyOption);
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : 0.3})
    .then((piano) => {
      this.harmonyPiano = piano;
    });
  }
  


  harmonizeAlgorithm = (harmonyOption) => {
    //creates chord for each note in harmonyChords, want to create chords for only notes on important beat
    //TODO: create new array importantNotes
    //TODO: base arrayA on notes timing and note ID
    //TODO: also add more chords progressions and stuff
    //TODO: maybe try to find all possible paths instead of just one path?
    const arrayA = this.props.song.notes.map((note) => this.keyToChord[note.pitch % 12]);
    const harmonyChords = [];
    for(var x = 0; x <arrayA[0].length; x++){
      const stack = [];
      const finalChord =[];
      const revHarmonyChords = [];
      const chordArray = {};
      stack.push([arrayA[0][x], 0]);
      while(stack.length>0){
        let a = stack.pop();
        let v = a[0];
        let i = a[1];
        if(i === arrayA.length-1){
          while(finalChord.length > 0){
            finalChord.pop();
            }
          finalChord.push([v,i]);
          break;
        }
        for(let n = 0; n < arrayA[i+1].length; n++){
          if(this.chordProgression[v].includes(arrayA[i+1][n])){
            stack.push([arrayA[i+1][n], i+1]);
            chordArray[JSON.stringify([arrayA[i+1][n], i+1])] = [v,i];
            while(finalChord.length > 0){
            finalChord.pop();
            }
            finalChord.push([[arrayA[i+1][n], i+1]]);
            }
          } 
        }
        if(finalChord.length>0 && finalChord[0][1] > arrayA.length-2){
      revHarmonyChords.push(finalChord[0][0]);
      for(var i = 0; i< arrayA.length-1; i++){
        finalChord[0] = JSON.stringify(finalChord[0]);
        finalChord[0] = chordArray[finalChord[0]];
        revHarmonyChords.push(finalChord[0][0]);
      }
      harmonyChords.push(revHarmonyChords.reverse());
    }
    this.setState({harmonyChords : harmonyChords});
  }
      const newNotesOne = this.state.harmonyLineOne.notes.map((note,i) => {
        const newPitch = this.chordToPitch[harmonyChords[harmonyOption-1][i]][0];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineOne : {...this.state.harmonyLineOne, notes : newNotesOne} });
      
      const newNotesTwo = this.state.harmonyLineTwo.notes.map((note,i) => {
        const newPitch = this.chordToPitch[harmonyChords[harmonyOption-1][i]][1];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineTwo : {...this.state.harmonyLineTwo, notes : newNotesTwo} });
      
      const newNotesThree = this.state.harmonyLineThree.notes.map((note,i) => {
        const newPitch = this.chordToPitch[harmonyChords[harmonyOption-1][i]][2];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineThree : {...this.state.harmonyLineThree, notes : newNotesThree} });

      const newNotesFour = this.state.harmonyLineFour.notes.map((note,i) => {
        const newPitch = this.chordToPitch[harmonyChords[harmonyOption-1][i]][3];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
      this.setState({harmonyLineFour : {...this.state.harmonyLineFour, notes : newNotesFour} });
       //TODO: create a possible harmony for each harmonyChords, account for inversions
    }



  changeChordMaps = () => {
    const chordProgression = {}; 
    const keyToChord = {};
    const chordToPitch = {};
    chordProgression["I"] = ["I", "ii", "ii7", "iii", "IV", "V", "V7", "vi", "vii", "vii7"];
    chordProgression["ii"] = ["ii", "V", "V7", "vii", "vii7"];
    chordProgression["ii7"] = ["ii7", "V", "V7", "vii", "vii7"];
    chordProgression["iii"] = ["iii", "vi"];
    chordProgression["IV"] = ["I", "ii", "ii7", "IV", "V", "V7", "vii", "vii7"];
    chordProgression["V"] = ["I", "V", "vi"];
    chordProgression["V7"] = ["I", "V7", "vi"];
    chordProgression["vi"] = ["ii", "ii7", "IV", "vi"];
    chordProgression["vii"] = ["I","vii"];
    chordProgression["vii7"] = ["I","vii7"];
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(this.props.song.key[0])];
    const supertonic = tonic + 2;
    const mediant = tonic + 5-this.props.song.key.length;
    const subdominant = tonic +5;
    const dominant = tonic + 7;
    const submediant = tonic + 10-this.props.song.key.length;
    const subtonic = tonic + 11;
    keyToChord[tonic % 12] = ["I", "ii7", "IV", "vi"];
    keyToChord[supertonic % 12] = ["ii", "ii7", "V", "V7", "vii", "vii7"];
    keyToChord[mediant % 12] = ["I", "iii", "vi"];
    keyToChord[subdominant % 12] = ["ii", "ii7", "IV", "V7", "vii", "vii7"];
    keyToChord[dominant % 12] = ["I", "iii", "V", "V7"];
    keyToChord[submediant % 12] = ["ii", "ii7", "IV", "vi", "vii7"];
    keyToChord[subtonic % 12] = ["iii", "V", "V7", "vii", "vii7"];
    chordToPitch["I"] = [tonic, mediant, dominant];
    chordToPitch["ii"] = [supertonic, subdominant, submediant];
    chordToPitch["ii7"] = [supertonic, subdominant, submediant, tonic];
    chordToPitch["III"] = [mediant, dominant, subtonic];
    chordToPitch["IV"] = [subdominant, submediant, tonic];
    chordToPitch["V"] = [dominant, subtonic, supertonic];
    chordToPitch["V7"] = [dominant, subtonic, supertonic, subdominant];
    chordToPitch["vi"] = [submediant, tonic, mediant];
    chordToPitch["vii"] = [subtonic, supertonic, subdominant];
    chordToPitch["vii7"] = [subtonic, supertonic, subdominant, submediant];
    this.chordToPitch = chordToPitch;
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
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
    console.log(this.state.saving)
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
              harmonyChords = {this.state.harmonyChords}
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
