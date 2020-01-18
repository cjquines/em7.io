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
    console.log("OKAY");
    let target = event.target;
    const targetId = target.getAttribute('data-id');
    console.log(targetId);
    const newNotes = [];
    for (const note of this.props.song.notes) {
    // console.log(`${note.id} asdf ${targetId}`);
    // console.log(targetId);
    // console.log(note.id == targetId);
      if (note.id == targetId) {
    // console.log("THIS ONE");
    // console.log(event);
    console.log(note.onset);
        const newOnset = note.onset + event.dx*this.state.widthUnit;
    console.log(newOnset);
    console.log(note.pitch);
        const newPitch = note.pitch + event.dy/this.state.heightUnit;
    console.log(newPitch);
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
          data-x="0"
          data-y="0"
          className="NoteBlock-note"
          style={{
            top: (note.pitch - 60)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}/>
        ))}
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x%4===0)).map((x) => (
          <div
            style={{
            left: x * 60000 / this.props.song.tempo / this.state.widthUnit + "px"}}
            className = "big-tempo-bar"/>
        ))}
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x%4 !==0)).map((x) => (
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
