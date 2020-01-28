import React, { Component } from "react";

import "./PianoKey.css"
import "../../utilities.css"

/**
 * Proptypes
 * @param {string} key_: keyboard key
 * @param {string} note: nani nani note
 * @param {boolean} isPressed: is pressed??
 * @param {boolean} isWhite: is white??
 * @param {integer} left: how left
 */
class PianoKey extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    return (
      <div
        className={"PianoKey "
                + (this.props.isWhite ? "PianoKey-white" : "PianoKey-black")
                + this.props.isPressed && " PianoKey-pressed"}
        style={{left: this.props.left + "%"}}
      >
        <span className="PianoKey-note">{this.props.note}</span>
        <span className="PianoKey-key">{this.props.key_}</span>
      </div>
    )
  }
}

export default PianoKey;
