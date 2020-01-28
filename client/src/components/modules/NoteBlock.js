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
 * @param {Song} harmony: harmony
 * @param {(number) => [number]} possibilities: (function) returns possibility given index
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
    if (!this.props.onChange) return;
    const elt = document.getElementById("NoteBlock-container");
    const offsetTop = elt.offsetTop + elt.offsetHeight;
    const offsetLeft = elt.offsetLeft;
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
    }).resizable({
      edges: { right: true },
      modifiers: [
        interact.modifiers.snapSize({
          targets: [
            interact.createSnapGrid({
              x: xSnapUnit,
              y: this.state.heightUnit,
              offset: { x: 0, y: 0 },
            }),
          ],
        }),
      ],
      onmove: this.resizeMoveListener,
    });
  }

  dragMoveListener = (event) => {
    let target = event.target;
    const targetId = target.getAttribute('data-id');
    const newNotes = [];
    for (const note of this.props.song.notes) {
      if (note.id == targetId) {
        const newOnset = note.onset + event.dx*this.state.widthUnit;
        const newPitch = note.pitch - event.dy/this.state.heightUnit;
        newNotes.push(new Note(targetId, newPitch, newOnset, note.length));
      } else {
        newNotes.push(note);
      }
    }
    this.props.onChange({...this.props.song, notes: newNotes});
    this.render();
  };

  resizeMoveListener = (event) => {
    let target = event.target;
    const targetId = target.getAttribute('data-id');
    const newNotes = [];
    for (const note of this.props.song.notes) {
      if (note.id == targetId) {
        const newLength = event.rect.width*this.state.widthUnit;
        newNotes.push(new Note(targetId, note.pitch, note.onset, newLength));
      } else {
        newNotes.push(note);
      }
    }
    this.props.onChange({...this.props.song, notes: newNotes});
    this.render();
  };

  getSongLength = () => {
    return Math.max(...this.props.song.notes.map((note) => (note.onset + note.length)),100)
  };

  handleHarmonyChange = (id, event) => {
    return;
  };

  render() {
    let options = {};
    if (this.props.harmony) {
      for (let i = 0; i < this.props.song.notes.length; i++) {
        const possibilities = this.props.possibilities(i);
        if (possibilities) {
          options[i] = possibilities.map((note, index) => (
            <option key={index} value={note}>{note}</option>
          ));
        }
      }
    }
    return (
      <div className="NoteBlock-container" id="NoteBlock-container" style = {{width: this.getSongLength()/this.state.widthUnit+ 24 + "px"}}>
        {this.props.song.notes.map((note, index) => (
          <div
          key={note.id}
          data-id={note.id}
          className="NoteBlock-note"
          style={{
            bottom: (note.pitch - 36)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}
          />))
        }
        {this.props.song.harmony.map((note, index) => (
          <div
          key={note.id}
          className="NoteBlock-harmony"
          style={{
            bottom: (note.pitch - 36)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}
          />))
        }
        {this.props.harmony && this.props.harmony.notes.map((note, index) => (
          <div
          key={note.id}
          className="NoteBlock-harmony"
          style={{
            // fix this
            bottom: (note.pitch - 36)*this.state.heightUnit + "px",
            width: (note.length / this.state.widthUnit) + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}
          />
          ))
        }
        {this.props.harmony && this.props.song.notes.map((note, index) => (
          <select
          key={note.id}
          //value={this.state.harmonySelect[note.id]}
          onChange={(e) => this.handleHarmonyChange(note.id, e)}
          style={{
            position: "absolute",
            bottom: -20 + "px",
            left: (note.onset / this.state.widthUnit) + "px",
          }}
          >
          {options[index]}
          </select>
          ))
        }
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x% this.props.song.signature[0]===0)).map((x, index) => (
          <div
            key={index}
            style={{
            left: x * 60000 / this.props.song.tempo / this.state.widthUnit + "px"}}
            className = "big-tempo-bar"
          />
        ))}
        {Array.from(Array(this.props.song.duration).keys()).filter((x) => (x% this.props.song.signature[0] !==0)).map((x, index) => (
          <div
            key={index}
            style={{
            left: x * 60000 / this.props.song.tempo / this.state.widthUnit + "px"}}
            className = "small-tempo-bar"
          />
        ))}
      </div>
    );
  }
}

export default NoteBlock;
