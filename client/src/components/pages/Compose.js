import React, { Component } from "react";
import { Link } from "@reach/router";
import Song from "../common/Song.js";
const keyboardJS = require("keyboardJS");

import "../../utilities.css";

/**
 * Compose is the page where we compose stuff.
 */
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: Date.now(),
      curkey: null,
      song: new Song("C", 120),
    };
  }

  componentDidMount() {
    keyboardJS.bind('a', (e) => {
      e.preventRepeat();
      this.setState({
        curkey: Date.now(),
      });
      console.log('a is pressed');
    }, (e) => {
      console.log('a is released');
      this.state.song.addNote(60, this.state.curkey - this.state.start, Date.now() - this.state.curkey);
    });
  }

  render() {
    return (
      <div className="Compose-container">
      compose page.
      
      {this.state.song.noteBlock()}
      </div>
    );
  }
}

export default Compose;
