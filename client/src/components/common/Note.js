/**
 * A note in a song.
 * @param {number} pitch - from 0 to 127, correspond to C-1 to G9, according to MIDI specification
 * @param {number} onset - in ms, amount of time after start that the note is played
 * @param {number} length - in ms, amount of time the note is played
 */
class Note {
  constructor(id, pitch, onset, length) {
    this.id = id;
    this.pitch = pitch;
    this.onset = onset;
    this.length = length;
  }
}

export default Note;
