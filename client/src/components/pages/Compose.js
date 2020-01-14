import React, { Component } from "react";
import { Link } from "@reach/router";
const keyboardJS = require("keyboardJS");

import "../../utilities.css";

/**
 * Compose is the page where we compose stuff.
 */
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      curkey: null,
      notes: [],
    };
  }

  componentDidMount() {
    this.setState({
      start: Date.now(),
    });
    keyboardJS.bind('a', (e) => {
      e.preventRepeat();
      this.setState({
        curkey: Date.now(),
      });
      console.log('a is pressed');
    }, (e) => {
      console.log('a is released');
      this.setState({
        notes: this.state.notes.concat([
          [
            (this.state.curkey - this.state.start)/20,
            (Date.now() - this.state.curkey)/20,
          ]
        ]),
      });
    });
  }

  render() {
    return (
      <div className="Compose-container">
      compose page; press and hold a on your keyboard
      
      {
        this.state.notes.map((l) => (
          <div style={{position: "absolute", top: "5em", width: l[1] + "px", left: l[0] + "px", height: "20px", background: "#000",}}></div>
        ))
      }
      </div>
    );
  }
}

export default Compose;
