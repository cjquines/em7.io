/**
 * A collection of notes with metadata.
 * @param {string} key - any of "C", "Cm", "D#m", etc.
 * @param {number[]} signature - a list of two integers for time signature
 * @param {number} tempo - tempo of the piece, in beats per minute.
 * @param {Note[]} notes - an array of notes
 */
class Song {
  constructor(key, signature, tempo) {
    this.key = key;
    this.signature = signature;
    this.tempo = tempo;
    this.notes = [];
    this.title = "Untitled"
    this.duration = 0;
  }
}

export default Song;
