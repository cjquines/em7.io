import React, { Component } from "react";
import { Link } from "@reach/router";

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

  changeChordMap() {
    const tonicMidi = this.state.pitchMap[this.state.pitch.indexOf(this.props.song.key)]; 
    const majorChordToKeyMap = {
      "I" : [tonicMidi, tonicMidi+4, tonicMidi+7],
      "ii" : [tonicMidi+2, tonicMidi+5, tonicMidi+9],
      "ii7" : [tonicMidi+2, tonicMidi+5, tonicMidi+9, tonicMidi+12],
      "iii" : [tonicMidi+3, tonicMidi+7, tonicMidi+11],
      "IV" : [tonicMidi+5, tonicMidi+9, tonicMidi+12],
      "V" : [tonicMidi+7, tonicMidi+11, tonicMidi+14],
      "V7" : [tonicMidi+7, tonicMidi+11, tonicMidi+14, tonicMidi+17],
      "vi" : [tonicMidi+9, tonicMidi+12, tonicMidi+16],
      "vii" : [tonicMidi+11, tonicMidi+14, tonicMidi+17],
      "vii7" : [tonicMidi+11, tonicMidi+14, tonicMidi+17, tonicMidi+21],
    };
    console.log(majorChordToKeyMap)
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
