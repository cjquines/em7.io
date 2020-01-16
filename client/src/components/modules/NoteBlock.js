import React, { Component } from "react";

// TODO: make this fancier
import "./NoteBlock.css";

/**
 * Block that contains the notes that we can edit and stuff.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing the notes of
 * @param {(Song) => void} onChange: (function) triggered when editing notes
 */
class NoteBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="NoteBlock-container">
        {this.props.song.notes.map((note, index) => (
          <div key={index}
          className="NoteBlock-note"
          style={{
            top: (note.pitch - 50)*20 + "px",
            width: (note.length / 20) + "px",
            left: (note.onset / 20) + "px",
          }}/>
        ))}
      </div>
    );
  }
}

export default NoteBlock;
