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
  };
  }

  componentDidMount() { 
    this.changeChordMaps();
  }



  changeChordMaps = () => {
    console.log(this.state.subtonic);
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
    keyToChord[tonic] = ["I", "ii7", "IV", "vi"];
    keyToChord[supertonic] = ["ii", "ii7", "V", "V7", "vii", "vii7"];
    keyToChord[mediant] = ["I", "iii", "vi"];
    keyToChord[subdominant] = ["ii", "ii7", "IV", "V7", "vii", "vii7"];
    keyToChord[dominant] = ["I", "iii", "V", "V7"];
    keyToChord[submediant] = ["ii", "ii7", "IV", "vi", "vii7"];
    keyToChord[subtonic] = ["iii", "V", "V7", "vii", "vii7"];
    this.setState({keyToChord : keyToChord});
    this.setState({chordProgression : chordProgression});
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
