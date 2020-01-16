import React, { Component } from "react";
import interact from "interactjs";

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
  
  componentDidMount() {
    interact('.NoteBlock-note').draggable({
      onmove: this.dragMoveListener,
    });
  }

  dragMoveListener = (event) => {
    let target = event.target
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

  render() {
    return (
      <div className="NoteBlock-container" id="NoteBlock-container">
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
