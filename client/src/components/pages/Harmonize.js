import React, { Component } from "react";
import { Link } from "@reach/router";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";
import { _ } from "core-js";

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
  };
  }

  componentDidMount() { 
    this.changeChordMaps();
    this.harmonizeAlgorithm();
  }


  harmonizeAlgorithm = () => {
    //creates chord for each note in harmonyChords, want to create chords for only notes on important beat
    //TODO: create new array importantNotes
    //TODO: base arrayA on notes timing and note ID
    const arrayA = this.props.song.notes.map((note) => this.keyToChord[note.pitch % 12]);
    const stack = [[arrayA[0][0], 0]];
    const finalChord =[];
    const revHarmonyChords = [];
    const chordArray = {};
      while(!(stack.isEmpty)){
        let a = stack.pop();
        let v = a[0];
        let i = a[1];
        if(i === arrayA.length-1){
          finalChord.push([v,i]);
          break;
        }
        for(let n = 0; n < arrayA[i+1].length; n++){
          if(this.chordProgression[v].includes(arrayA[i+1][n])){
            stack.push([arrayA[i+1][n], i+1]);
            chordArray[JSON.stringify([arrayA[i+1][n], i+1])] = [v,i];
          }
        }
      }
      revHarmonyChords.push(finalChord[0][0]);
      for(var i = 0; i< arrayA.length-1; i++){
        finalChord[0] = JSON.stringify(finalChord[0]);
        finalChord[0] = chordArray[finalChord[0]];
        revHarmonyChords.push(finalChord[0][0]);
      }
      var harmonyChords = revHarmonyChords.reverse();
      console.log(harmonyChords);
    }



  changeChordMaps = () => {
    const chordProgression = {}; 
    const keyToChord = {};
    chordProgression["I"] = ["I", "ii", "ii7", "iii", "IV", "V", "V7", "vi", "vii", "vii7"];
    chordProgression["ii"] = ["V", "V7", "vii", "vii7"];
    chordProgression["ii7"] = ["V", "V7", "vii", "vii7"];
    chordProgression["iii"] = ["vi"];
    chordProgression["IV"] = ["I", "ii", "ii7", "V", "V7", "vii", "vii7"];
    chordProgression["V"] = ["I", "vi"];
    chordProgression["V7"] = ["I", "vi"];
    chordProgression["vi"] = ["ii", "ii7", "IV"];
    chordProgression["vii"] = ["I"];
    chordProgression["vii7"] = ["I"];
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
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
  };


  render() {
    return (
      <div className="Harmonize-container">
      Harmonize page {this.state.tonic}
      <NoteBlock
        song={this.props.song}
        onChange={this.props.onChange}
      />
      </div>
    );
  }
}

export default Harmonize;
