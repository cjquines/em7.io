import React, { Component } from "react";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";

import em7piano from "../../public/em7piano.png";

import "../../utilities.css";
import "./Splash.css";

/**
 * Splash is the splash page of the website.
 */
class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  
  postSong = (value) => {
    const body = { _id: 100, name: "qyt" };
    post("/api/user", body).then((user) => {
      console.log(user)
    });
  }


  render() {
    return (
      <div className="Splash-container">
        <div className="logo">
          <p className="title">em7.io</p>
          <p className="subtitle">Create your own harmonies!</p>
          <img src = {em7piano} className = "splash-piano-png"/>
        </div>
        
        <div className="splash-button-container">
          <a href="/compose" className="redButton">Compose</a>
          <a href="/listen" className="redButton">Listen</a>
          <button type = "button" onClick ={this.postSong}>goodButton</button>
        </div>
      </div>
    );
  }

}

export default Splash;
