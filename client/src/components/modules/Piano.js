import React, { Component } from "react";

import PianoKey from "./PianoKey.js";

import "./Piano.css"
import "../../utilities.css"

/**
 * Proptypes
 * @param {[string]} keys: keyboard keys
 * @param {[integer]} notes: nani nani notes
 * @param {[boolean]} pressed: is key pressed?
 */
class Piano extends Component {
  constructor(props) {
    super(props);
    this.left = [0, 20/3, 10, 50/3, 20, 30, 110/3, 40, 140/3, 50, 170/3, 60, 70, 230/3, 80, 260/3, 90];
    this.isWhite = [true, false, true, false, true, true, false, true, false, true, false, true, true, false, true, false, true];
  }

  componentDidMount() { }

  render() {
    console.log(this.props.keys);
    return (
      <div className="Piano">
        {
          this.props.keys.map((key, index) => (
            <PianoKey
              key={key}
              key_={key}
              note={this.props.notes[index]}
              isWhite={this.isWhite[index]}
              isPressed={this.props.pressed[key]}
              left={this.left[index]}
            />
          ))
        }
      </div>
    )
  }
}

export default Piano;
