import React, { Component } from "react";
import interact from "interactjs";

import Note from "../common/Note.js";

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
      heightUnit: 12,
      widthUnit: 5,
    };
  }
  
  componentDidMount() {
    const offsetTop = document.getElementById("NoteBlock-container").offsetTop;
    const offsetLeft = document.getElementById("NoteBlock-container").offsetLeft;
    const xSnapUnit = this.props.snapInterval / this.state.widthUnit;
    interact('.NoteBlock-note').draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.createSnapGrid({
              x: xSnapUnit,
              y: this.state.heightUnit,
              offset: { x: offsetLeft, y: offsetTop },
            }),
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
    const targetId = target.getAttribute('data-id');
    const newNotes = [];
    for (const note of this.props.song.notes) {
      if (note.id == targetId) {
        console.log(`${event.dx} ${event.dy}`);
        const newOnset = note.onset + event.dx*this.state.widthUnit;
        const newPitch = note.pitch + event.dy/this.state.heightUnit;
        newNotes.push(new Note(targetId, newPitch, newOnset, note.length));
      } else {
        newNotes.push(note);
      }
    }
    this.props.onChange({...this.props.song, notes: newNotes});

    // const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    // const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // target.style.webkitTransform =
    //   target.style.transform =
    //     'translate(' + x + 'px, ' + y + 'px)';

    // target.setAttribute('data-x', x);
    // target.setAttribute('data-y', y);
    this.render();
  }

  getSongLength = () => {
    return Math.max(...this.props.song.notes.map((note) => (note.onset + note.length)),100)
  }

  render() {
    return (
      <div className="NoteBlock-container" id="NoteBlock-container" style = {{width: this.getSongLength()/this.state.widthUnit+ 24 + "px"}}>
        {this.props.song.notes.map((note, index) => (
          <div
          key={note.id}
          data-id={note.id}
          className="NoteBlock-note"
          style={{
            top: (note.pitch - 60)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}/>
        ))}
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x% this.props.song.signature[0]===0)).map((x) => (
          <div
            style={{
            left: x * 60000 / this.props.song.tempo / this.state.widthUnit + "px"}}
            className = "big-tempo-bar"/>
        ))}
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x% this.props.song.signature[0] !==0)).map((x) => (
          <div
            style={{
            left: x * 60000 / this.props.song.tempo / this.state.widthUnit + "px"}}
            className = "small-tempo-bar"/>
        ))}
      </div>
    );
  }
}

export default NoteBlock;
