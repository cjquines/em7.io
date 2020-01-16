import React, { Component } from "react";
import { Link } from "@reach/router";

import "../../utilities.css";

/**
 * Splash is the splash page of the website.
 */
class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    return (
      <div className="Splash-container">
        <div className="logo">
          <p className="title">em7.io</p>
          <p className="subtitle">Create your own harmonies!</p>
        </div>
        <div className="u-flex-justifyCenter u-flex-grid">
          <a href="/compose" className="redButton">Compose</a>
          <a href="/listen" className="redButton">Listen</a>
        </div>
      </div>
    );
  }

}

export default Splash;
