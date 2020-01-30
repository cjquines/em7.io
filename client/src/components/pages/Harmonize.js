import React, { Component } from "react";
import { Link } from "@reach/router";
import Note from "../common/Note.js";
import NoteBlock from "../modules/NoteBlock.js";
import "../../utilities.css";
import { _ } from "core-js";
const Soundfont = require("soundfont-player");
import HarmonyInput from "../modules/HarmonyInput.js";

import "./Compose.css";
import SnapIntervalInput from "../modules/SnapIntervalInput";
import Dialogue from "../modules/Dialogue.js";
import { get, post } from "../../utilities.js";

/**
 * Page where people can select harmonies.
 *
 * Proptypes
 * @param {string} songId: the song ID
 */
class Harmonize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chordProgression : {},
      pitchMap: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
      pitch: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
      keyToChord: {},
      chordArray: {},
      harmony: undefined,
      isProcessed: false,
      isKeyChanged: false,
      saving: false,
      isPlayingBack: false,
      song: undefined,
      loggedIn : false,
    };
    this.audioContext = new AudioContext();
    this.harmonyChords = [];
  }

  componentDidMount() {
    //const timer = window.setTimeout(window.location.reload(), 10*1000);
    get("/api/whoami").then((user) => {
      if (user._id) {
        this.state.loggedIn = true;
      }
      console.log(this.state.loggedIn);
    });
    get("/api/song", { _id: this.props.songId }).then((song) => {
      song.content.notes.sort((a, b) => a.onset - b.onset);
      //TODO: try/catch for melodies with no harmony (but for some reason this doesnt work idk)
      this.setState({
        harmony: {...song.content, notes: []},
        song: song.content,
      }, () => {
        if (this.attemptHarmonize(this.state.song.key, this.state.song.notes)) {
          this.harmonizeAlgorithm();
        } else {
          console.log("no harmonies found; trying different keys");
          let goodKey = undefined;
          for (const tonic of this.state.pitch) {
            if (this.attemptHarmonize(tonic, this.state.song.notes)) {
              goodKey = tonic;
              break;
            }
            if (this.attemptHarmonize(tonic + "m", this.state.song.notes)) {
              goodKey = tonic + "m";
              break;
            }
          }
          if (goodKey) {
            this.setState({isKeyChanged: true, song: {...this.state.song, key: goodKey}}, () => {
              this.harmonizeAlgorithm();
            });
          }
          console.log("no key found where the song has a harmony");
        }
        //window.clearTimeout(timer);
        this.setState({isProcessed: true});
      });
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : 1})
    .then((piano) => {
      this.piano = piano;
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : .3})
    .then((piano) => {
      this.harmonyPiano = piano;
    });
  }

  attemptHarmonize = (key, notes) => {
    if (key.includes('m')) {
      this.changeChordMinorMaps(key, notes);
    } else {
      this.changeChordMajorMaps(key, notes);
    }
    for (const note of this.chordChoices[0]) {
      if (this.harmonizeHelper([[note, 0]])) {
        return true;
      }
    }
    return false;
  };

  // saveSong = () => {
  //   get("/api/whoami").then((user) => {
  //     const content = {...this.state.song, harmony: this.state.harmony.notes};
  //     let body = { song_id: this.state.song._id, content: content, name: this.state.song.title };
  //     post("/api/song", body).then((response) => {
  //         console.log(response);
  //         if (response._id) {
  //           this.setState({ song: {...this.state.song, _id: response._id } });
  //         }
  //     });
  //   });
  //   console.log(this.state.song)
  //   console.log("saving from harmonizing page")
  // };

  saveSong = () => {
    get("/api/whoami").then((user) => {
      const content = {...this.state.song, harmony: this.state.harmony.notes};
      let body = { content: content, creator_id: user._id, name: this.state.song.title, key: this.state.song.key };

      if (this.props.songId) {
        body = { ...body, song_id: this.props.songId };
      }
      post("/api/song", body).then((response) => {
        console.log(response);

          if (response._id) {
            this.setState({ song: {...this.state.song, _id: response._id } });
          }
      });
    });
    console.log(this.state.song._id)
    console.log("saving from harmonize page")
    // get("/api/song", { _id: this.props.songId }).then((song) => console.log("funny song", song)).catch((err) => {console.log("err")});
  };

  harmonizePossibilities = (i) => {
    if (!this.chordChoices) return;
    let result = [];
    console.log(this.chordChoices);
    console.log(i);
    if (i === 0) {
      const w = this.harmonyChords[i+1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[u].includes(w)) {
          result.push(u);
        }
      }
    } else if (i === this.harmonyChords.length - 1) {
      const v = this.harmonyChords[i-1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[v].includes(u)) {
          result.push(u);
        }
      }
    } else {
      const v = this.harmonyChords[i-1];
      const w = this.harmonyChords[i+1];
      for (const u of this.chordChoices[i]) {
        if (this.chordProgression[v].includes(u) && this.chordProgression[u].includes(w)) {
          result.push(u);
        }
      }
    }
    console.log(result);
    return result;
  };

  harmonizeHelper = (curPath) => {
    const a = curPath[curPath.length - 1];
    const v = a[0];
    const i = a[1];
    if (i === this.chordChoices.length - 1) {
      const revHarmonyChords = curPath.map((tup) => tup[0]);
      this.harmonyChords = revHarmonyChords;
      return true;
    }
    for (const u of this.chordChoices[i+1]) {
      if (this.chordProgression[v].includes(u)) {
        if (this.harmonizeHelper(curPath.concat([[u, i+1]]))) {
          return true;
        }
      }
    }
    return false;
  };

  harmonizeAlgorithm = () => {
    //TODO: base chordChoices on notes timing and not note ID to account for editing
    //TODO: also add more chords progressions and stuff
    //account for major/minor changes in the secondary harmony chords (only major is accounted for for now)
    //mess around with the order of the arrays to give preference to some harmonies

    console.log(this.harmonyChords);
    let harmony = [];
    for (let i = 0; i < this.state.song.notes.length; i++) {
      const note = this.state.song.notes[i];
      const chord = this.chordToPitch[this.harmonyChords[i]];
      for (let j = 0; j < chord.length; j++) {
        const newNote = new Note(4*i + j, chord[j], note.onset, note.length);
        harmony.push(newNote);
      }
    }
    this.setState({harmony: {...this.state.harmony, notes: harmony}});
  };

  changeChordMinorMaps = (key, notes) => {
    const chordProgression = {}; 
    const keyToChord = {};
    const chordToPitch = {};

      chordProgression["i"] = ["i", "ii°", "III", "iv", "v", "V", "VI", "VII", "V/v", "V7/VI", "V/iv"];
      chordProgression["ii°"] = ["ii°", "v", "V", "VII", "V/v", "V7/VI"];
      chordProgression["iv"] = ["i", "ii°", "iv", "v", "V", "VII", "V/v", "V7/VI"];
      chordProgression["v"] = ["i", "v", "V", "VI", "V/v", "V7/VI"];
      chordProgression["V"] = ["i", "v", "V", "VI", "V/v", "V7/VI"];
      chordProgression["V/v"] = ["v", "V", "V/v"];
      chordProgression["V/iv"] = ["iv", "V/iv"];
      chordProgression["V7/VI"] = ["vi", "V7/VI"];
      chordProgression["VI"] = ["ii°", "iv", "VI", "V/v", "V7/VI"];
      chordProgression["VII"] = ["i", "VII", "V/v", "V7/VI", "III"];
      chordProgression["III"] = ["III", "VI"];
      const tonic = this.state.pitchMap[this.state.pitch.indexOf(key.replace('m', ''))];
      const supertonic = tonic + 2;
      const mediant = tonic + 4-(+key.includes('m'));
      const subdominant = tonic +5;
      const dominant = tonic + 7;
      const submediant = tonic + 9- (+key.includes('m'));
      const subtonic = tonic + 11-(+key.includes('m'));
      //const subtonic = tonic + 11; (harmonic minor)
      keyToChord[tonic % 12] = ["i",  "iv", "VI"];
      keyToChord[(tonic+1) % 12] = ["V7/VI"];
      keyToChord[supertonic % 12] = ["ii°",  "v", "V",  "VII", "V/v"];
      keyToChord[mediant % 12] = ["i", "III", "VI", "V7/VI"];
      keyToChord[(mediant+1) % 12] = ["V/iv"];
      keyToChord[subdominant % 12] = [ "iv", "ii°", "VII"];
      keyToChord[(subdominant+1) % 12] = ["V/v"]
      keyToChord[dominant % 12] = ["i", "III", "v", "V", "V7/VI"];
      keyToChord[submediant % 12] = ["ii°", "iv", "VI", "V/v"];
      keyToChord[(subtonic-1) % 12] = ["V/v"];
      keyToChord[(subtonic+1) % 12] = ["V"];
      keyToChord[subtonic % 12] = [ "v",  "VII", "III", "V7/VI" ];
      chordToPitch["i"] = [tonic-12, mediant-12, dominant-12];
      chordToPitch["ii°"] = [supertonic-12, subdominant-12, submediant-12];
      chordToPitch["iv"] = [subdominant-12, submediant-12, tonic-12];
      chordToPitch["v"] = [dominant-12, subtonic-24, supertonic-12];
      chordToPitch["V"] = [dominant-12, subtonic-23, supertonic-12];
      chordToPitch["VI"] = [submediant-24, tonic-12, mediant-12];
      chordToPitch["VII"] = [subtonic-24, supertonic-12, subdominant-12];
      chordToPitch["V/iv"] = [tonic-12, mediant-11, dominant-12];
      chordToPitch["V/v"] = [supertonic-12, subdominant-11, submediant-11];
      chordToPitch["V7/VI"] = [mediant-12, dominant-12, subtonic-12, tonic-11];
      chordToPitch["III"] = [mediant-12, dominant-12, subtonic-12]


      this.chordToPitch = chordToPitch;
      this.keyToChord = keyToChord;
      this.chordProgression = chordProgression;
      this.chordChoices = notes.map((note) => keyToChord[note.pitch % 12]);
    };
  
    changeChordMajorMaps = (key, notes) => {
      const chordProgression = {}; 
      const keyToChord = {};
      const chordToPitch = {};
  

    chordProgression["I"] = ["I", "ii", "iii", "IV", "V", "vi", "vii°", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["ii"] = ["ii", "V", "vii°", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["IV"] = ["I", "ii", "IV", "V", "vii°", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["V"] = ["I", "V", "vi", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["V/V"] = ["V", "V/V"];
    chordProgression["V/ii"] = ["ii", "V/ii"];
    chordProgression["V/vi"] = ["vi", "V/vi"];
    chordProgression["V7/IV"] = ["IV", "V7/IV"];
    chordProgression["V/iii"] = ["iii", "V/iii"];
    chordProgression["vi"] = ["ii", "IV", "vi", "V/V", "V/ii", "V/vi", "V7/IV", "V/iii"];
    chordProgression["vii°"] = ["I", "vii°", "V/V", "V/ii", "V/vi", "V7/IV", "iii","V/iii"];
    chordProgression["iii"] = ["iii", "vi"];
    const tonic = this.state.pitchMap[this.state.pitch.indexOf(key.replace('m', ''))];
    const supertonic = tonic + 2;
    const mediant = tonic + 4-(+key.includes('m'));
    const subdominant = tonic +5;
    const dominant = tonic + 7;
    const submediant = tonic + 9- (+key.includes('m'));
     const subtonic = tonic + 11-(+key.includes('m'));
    //const subtonic = tonic + 11; (harmonic minor)
    keyToChord[tonic % 12] = ["I",  "IV", "vi"];
    keyToChord[(tonic+1) % 12] = ["V/ii"];
    keyToChord[supertonic % 12] = ["ii",  "V",  "vii°", "V/V"];
    keyToChord[(supertonic+1) % 12] = ["V/iii"]
    keyToChord[mediant % 12] = ["I", "iii", "vi", "V/ii"];
    keyToChord[subdominant % 12] = [ "IV", "ii",  "vii°"];
    keyToChord[(subdominant+1) % 12] = ["V/V"]
    keyToChord[dominant % 12] = ["I", "iii", "V"];
    keyToChord[(dominant+1) % 12] = ["V/vi"];
    keyToChord[submediant % 12] = ["ii", "IV", "vi", "V/V", "V/ii"];
    keyToChord[(subtonic-1) % 12] = ["V7/IV"];
    keyToChord[subtonic % 12] = [ "V",  "vii°", "iii" ];
    chordToPitch["I"] = [tonic-12, mediant-12, dominant-12];
    chordToPitch["ii"] = [supertonic-12, subdominant-12, submediant-12];
    chordToPitch["IV"] = [subdominant-12, submediant-12, tonic-12];
    chordToPitch["V"] = [dominant-12, subtonic-24, supertonic-12];
    chordToPitch["vi"] = [submediant-24, tonic-12, mediant-12];
    chordToPitch["vii°"] = [subtonic-24, supertonic-12, subdominant-12];
    chordToPitch["V/V"] = [supertonic-12, subdominant-11, submediant-12];
    chordToPitch["V/ii"] = [submediant-12, tonic-11, mediant-12];
    chordToPitch["V/vi"] = [mediant-12, dominant-11, subtonic-12];
    chordToPitch["V7/IV"] = [tonic-12, mediant-12, dominant-12, subtonic-13]; 
    chordToPitch["iii"] = [mediant-12, dominant-12, subtonic-12];
    chordToPitch["V/iii"] = [subtonic-12, supertonic-11, subdominant-11];
    

    this.chordToPitch = chordToPitch;
    this.keyToChord = keyToChord;
    this.chordProgression = chordProgression;
    this.chordChoices = notes.map((note) => keyToChord[note.pitch % 12]);
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.harmony.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    const duration = Math.max(...this.state.song.notes.map((notes) => notes.onset+notes.length));
    this.timeout = setTimeout(this.stop, duration);
  };

  stop = () => {
    this.setState({isPlayingBack: false,});
    clearTimeout(this.timeout);
    this.piano.stop();
    this.harmonyPiano.stop();
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.piano.stop();
    this.harmonyPiano.stop();
  };

  openSaveDialogue = () => {
    this.setState({saving: true});
  };
  
  closeDialogue = () => {
    this.setState({saving: false});
  };

  alert = () => {
    alert("Log in first and refresh the page!");
  }

  render() {
    if (!this.state.isProcessed) {
      return <div>Loading...</div>;
    }
    if (this.state.harmony.notes.length === 0) {
      return (

<div className="Harmonize-container u-flexColumn">
      <Dialogue id = "saveDialogue"
        closingFunction={this.closeDialogue}
        display={this.state.saving}
        title={this.state.song.title}
        saveFunction={this.saveSong}
        onChange={(title) => this.setState({song: {...this.state.song, title: title}})}
      />

      <div className = "u-flex-spaceBetween u-flexColumn">
        <p style= {{lineHeight: 1.7}}> No harmonies found! Your song is still saved, but we couldn't automatically find a harmony for you.</p>
        <div className = "titles">
          <h1>{this.state.song.title}</h1>
        </div>
        <div className="big-noteblock-container">
          <NoteBlock
            //harmony={this.state.harmony}
            song={this.state.song}
            //harmonyChords={this.harmonyChords}
            //onHarmonyChange={(index, value) => {this.harmonyChords[index] = value; this.harmonizeAlgorithm();}}
            //possibilities={this.harmonizePossibilities}
          />
        </div>
      </div>
      <div className="u-flex confirm-buttons-container">
      <Link to={`/compose/${this.props.songId}`}>
        <button type="button" className="goodButton">Back</button>
      </Link>
        {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
        }
        {this.state.loggedIn
          ? <button type="button" className="goodButton" onClick={this.openSaveDialogue}>Save</button>
          : <button type="button" className="greyButton" onClick={this.alert} >Save</button>
        }
        {/* <HarmonyInput
          harmonyOption={this.state.harmonyOption}
          harmonyChords = {this.harmonyChords.length}
          defaultHarmony="1"
          onChange={(harmonyOption) => {this.setState({harmonyOption : harmonyOption}), 
          this.harmonizeAlgorithm(harmonyOption)}}
        /> */}
      </div>
    </div>
    );
      
    }
    return (
    <div className="Harmonize-container u-flexColumn">
      <Dialogue id = "saveDialogue"
        closingFunction={this.closeDialogue}
        display={this.state.saving}
        title={this.state.song.title}
        saveFunction={this.saveSong}
        onChange={(title) => this.setState({song: {...this.state.song, title: title}})}
      />
      <div className = "u-flex-spaceBetween u-flexColumn">
        <div className = "titles">
          <h2>Harmonize</h2>
          <h1>{this.state.song.title}</h1>
        </div>
        {this.state.isKeyChanged && (<p style= {{lineHeight: 1.7}}> No harmonies found! Your song is still saved, but we couldn't automatically find a harmony for you.</p>)}
        <div className="big-noteblock-container">
          <NoteBlock
            harmony={this.state.harmony}
            song={this.state.song}
            harmonyChords={this.harmonyChords}
            onHarmonyChange={(index, value) => {this.harmonyChords[index] = value; this.harmonizeAlgorithm();}}
            possibilities={this.harmonizePossibilities}
          />
        </div>
      </div>
      <div className="u-flex confirm-buttons-container">
      <Link to={`/compose/${this.props.songId}`}>
        <button type="button" className="goodButton">Back</button>
      </Link>
        {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
        }
        {this.state.loggedIn
          ? <button type="button" className="goodButton" onClick={this.openSaveDialogue}>Save</button>
          : <button type="button" className="greyButton" onClick={this.alert} >Save</button>
        }
        {/* <HarmonyInput
          harmonyOption={this.state.harmonyOption}
          harmonyChords = {this.harmonyChords.length}
          defaultHarmony="1"
          onChange={(harmonyOption) => {this.setState({harmonyOption : harmonyOption}), 
          this.harmonizeAlgorithm(harmonyOption)}}
        /> */}
      </div>
    </div>
    );
  }
}

export default Harmonize;
