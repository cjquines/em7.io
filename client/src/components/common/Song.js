import React from "react";
import Note from "./Note.js";

/**
 * A collection of notes with metadata.
 * @param {string} key - any of "C", "Cm", "D#m", etc.
 * @param {number} tempo - tempo of the piece, in beats per minute.
 * @param {Note[]} notes - an array of notes
 */
class Song {
  constructor(key, tempo) {
    this.key = key;
    this.tempo = tempo;
    this.notes = [];

    this.addNote = this.addNote.bind(this);
    this.noteBlock = this.noteBlock.bind(this);
  }

  addNote(pitch, onset, length) {
    this.notes.push(new Note(pitch, onset, length));
  }

  noteBlock() {
    return this.notes.map((note, index) => (
      <div key={index}
      style={{
        position: "absolute",
        top: "5em",
        width: (note.length / 20) + "px",
        left: (note.onset / 20) + "px",
        height: "20px",
        background: "#000",
      }}/>
    ));
  }
}

export default Song;
