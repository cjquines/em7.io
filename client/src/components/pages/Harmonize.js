import React, { Component } from "react";
import { Link } from "@reach/router";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";
import { _ } from "core-js";
const Soundfont = require("soundfont-player");

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
  };
  this.audioContext = new AudioContext();
  }

  componentDidMount() { 
    this.changeChordMaps();
    this.harmonizeAlgorithm();
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
    });
  }
  


  harmonizeAlgorithm = () => {
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
  }
      console.log(harmonyChords);
      const newNotes = this.state.harmony.notes.map((note,i) => {
        const newPitch = this.chordToPitch[harmonyChords[0][i]];
        return new Note(note.id, newPitch, note.onset, note.length);
      });
console.log(newNotes);
      this.setState({harmony : {...this.state.harmony, notes : newNotes} });
       //TODO: create a possible harmony for each harmonyChords 
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
    chordToPitch["I"] = tonic;
    chordToPitch["ii"] = supertonic;
    chordToPitch["ii7"] = supertonic;
    chordToPitch["III"] = mediant;
    chordToPitch["IV"] = subdominant;
    chordToPitch["V"] = dominant;
    chordToPitch["V7"] = dominant;
    chordToPitch["vi"] = submediant;
    chordToPitch["vii"] = subtonic;
    chordToPitch["vii7"] = subtonic;
    this.chordToPitch = chordToPitch;
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.props.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.piano.schedule(this.audioContext.currentTime, this.state.harmony.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
  };

  stop = () => {
    this.setState({isPlayingBack: false,});
    this.piano.stop();
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
        </div>
    </div>
    
    );
  }
}

export default Harmonize;
