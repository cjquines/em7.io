import React, { Component } from "react";
import { Link } from "@reach/router";

import em7piano from "../../public/em7piano.png";

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
          <img src = {em7piano} className = "piano-img"/>
        </div>
        
        <div className="splash-button-container">
          <a href="/compose" className="redButton">Compose</a>
          <a href="/listen" className="redButton">Listen</a>
        </div>
      </div>
    );
  }

}

export default Splash;
