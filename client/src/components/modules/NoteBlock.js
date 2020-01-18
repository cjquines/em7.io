import React, { Component } from "react";
import interact from "interactjs";

// TODO: make this fancier
import "./NoteBlock.css";

/**
 * Block that contains the notes that we can edit and stuff.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing the notes of
 * @param {number} snapInterval: the snap interval in ms
 * @param {(Song) => void} onChange: (function) triggered when editing notes
 */
class NoteBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightUnit: 20,
      widthUnit: 5,
    };
  }
  
  componentDidMount() {
    const xSnapUnit = this.props.snapInterval / this.state.widthUnit;
    interact('.NoteBlock-note').draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.createSnapGrid({
              x: xSnapUnit,
              y: this.state.heightUnit,
              offset: { x: 0, y: 0 },
            })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        }),
      ],
      onmove: this.dragMoveListener,
    });
  }

  dragMoveListener = (event) => {
    let target = event.target;

    const newOnset = event.dx * this.state.widthUnit;
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  getSongLength = () => {
    return Math.max(...this.props.song.notes.map((note) => (note.onset + note.length)))
  }


  render() {
    return (
      <div className="NoteBlock-container" id="NoteBlock-container" style = {{width:  this.getSongLength()/this.state.widthUnit+ 24 + "px"}}>
        {this.props.song.notes.map((note, index) => (
          <div key={index}
          data-x="0"
          data-y="0"
          className="NoteBlock-note"
          style={{
            top: (note.pitch - 60)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}/>
        ))}
      </div>
    );
  }
}

export default NoteBlock;
