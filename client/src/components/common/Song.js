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
  }
}

export default Song;
