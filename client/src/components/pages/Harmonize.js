import React, { Component } from "react";
import { Link } from "@reach/router";

import "../../utilities.css";

/**
 * Page where people can select harmonies.
 *
 * Proptypes
 * @param {Song} song: the song (NEEDS TO CHANGE SOON; UPLOAD AND DOWNLOAD FROM SERVER)
 */
class Harmonize extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    return (
      <div className="Harmonize-container">
      Harmonize page
      </div>
    );
  }
}

export default Harmonize;
