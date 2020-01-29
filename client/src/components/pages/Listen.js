import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
import NoteBlock from "../modules/NoteBlock.js";
const Soundfont = require("soundfont-player");
import UserBlock from "../modules/UserBlock.js"
import "../../utilities.css";

/**
 * Listen is the page where we edit stuff.
 * @param songId
 */
class Listen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      song: undefined,
      snapInterval: 125,
      isPlayingBack: false,
      users: undefined,
    };
    this.audioContext = new AudioContext();
  }

  componentDidMount() {
    this.count = 0
    this.userdata = {};
    get("/api/song", { _id: this.props.songId }).then((song) => {
      song.content.notes.sort();
      this.setState({
        song: song.content,
      })
    });

    get("/api/users").then((users) => {
      users.map((user) => 
      get(`/api/songs`, {creator_id: user._id}).then((songList) => {
          this.userdata[user._id] = songList.length
          this.setState({
            users: users,
          });
        }))

    });

    


    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano')
    .then((piano) => {
      this.piano = piano;
    });
    Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {gain : .3})
    .then((piano) => {
      this.harmonyPiano = piano;
    });
  }

  saveSong = () => {
    get("/api/whoami").then((user) => {
      let body = { creator_id: user._id, name: this.state.song.title, content: this.state.song };
      post("/api/song", body).then((response) => {
        this.setState({ song: {...this.state.song, _id: response._id } });
      });
    });
  };

  play = () => {
    this.setState({isPlayingBack: true,});
    this.piano.schedule(this.audioContext.currentTime, this.state.song.notes.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.harmonyPiano.schedule(this.audioContext.currentTime, this.state.song.harmony.map((note) => {
      return { time: note.onset/1000, note: note.pitch, duration: note.length/1000 }
    }));
    this.timeout = setTimeout(this.stop, this.state.song.duration*1000-1000);
  };

  stop = () => {
    this.setState({isPlayingBack: false});
    clearTimeout(this.timeout);
    this.piano.stop();
    this.harmonyPiano.stop();
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.piano.stop();
    this.harmonyPiano.stop();
  };

  render() {
    let displayedList = null;
    if (this.state.song == undefined && this.state.users == undefined) {
      return (<div>loading...</div>)
    }
    else if (this.state.song == undefined){
      displayedList = this.state.users.map((user) =>
      <UserBlock
        name = {user.name}
        id = {user._id}
        songs = {this.userdata[user._id]}
      />)
      return (
        <div className = "profile-container">
        <h1 className="profile-name u-textCenter">Search songs by composer!</h1>
        <div className="grid-container">{displayedList}
        </div>
      </div>
      )
    }
    return (
      <>
        <div className = "titles" style={{marginBottom: -6+"vh"}}>
          <h1>{this.state.song.title}</h1>
        </div>
        <div className="playback-row">
          <div className="big-noteblock-container">
            <NoteBlock
              song={this.state.song}
              snapInterval={this.state.snapInterval}
            />
          </div>
        </div>

        <div className="u-flex confirm-buttons-container">
          {this.state.isPlayingBack
          ? <button type="button" className="greyButton" onClick={this.stop}>Stop</button>
          : <button type="button" className="greyButton" onClick={this.play}>Play</button>
          }
        </div>
      </>
    )
  }
}

export default Listen;
