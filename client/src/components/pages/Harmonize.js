import React, { Component } from "react";
import { Link } from "@reach/router";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";

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
    majorChordMap: {"I" : ["I", "ii", "ii7", "iii", "IV", "V", "V7", "vi", "vii", "vii7"],
      "ii" : ["V", "V7", "vii", "vii7"],
      "ii7" : ["V", "V7", "vii", "vii7"],
      "iii" : ["vi"],
      "IV" : ["I", "ii", "ii7", "V", "V7", "vii", "vii7"],
      "V" : ["I", "vi"],
      "V7" : ["I", "vi"],
      "vi" : ["ii", "ii7", "IV"],
      "vii" : ["I"],
      "vii7" : ["I"]
    },
    pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
    pitch: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    majorChordToKeyMap : {},
  };
  }

  componentDidMount() { 
    this.changeChordMap();
  }

  changeChordMap = () => {
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(this.props.song.key)]; 
    const supertonic = tonic + 2;
    const mediant = tonic + 4;
    const subdominant = tonic + 5;
    const dominant = tonic + 7;
    const submediant = tonic + 9;
    const subtonic = tonic + 11;
    const majorChordToKeyMap = {};
    majorChordToKeyMap[tonic] = ["I", "ii7", "IV", "vi"];
    majorChordToKeyMap[supertonic] = ["ii", "ii7", "V", "V7", "vii", "vii7"];
    majorChordToKeyMap[mediant] = ["I", "iii", "vi"];
    majorChordToKeyMap[subdominant] = ["ii", "ii7", "IV", "V7", "vii", "vii7"];
    majorChordToKeyMap[dominant] = ["I", "iii", "V", "V7"];
    majorChordToKeyMap[submediant] = ["ii", "ii7", "IV", "vi", "vii7"];
    majorChordToKeyMap[subtonic] = ["iii", "V", "V7", "vii", "vii7"];
    this.setState({majorChordToKeyMap : majorChordToKeyMap});
  } 


  render() {
    return (
      <div className="Harmonize-container">
      Harmonize page
      <NoteBlock
        song={this.props.song}
        onChange={this.props.onChange}
      />
      </div>
    );
  }
}

export default Harmonize;
