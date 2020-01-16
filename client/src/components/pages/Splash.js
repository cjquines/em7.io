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
      <h1>splash page</h1>
      <div className="u-flex-justifyCenter">
      <button><Link to="/compose" className="navbar-link">compose</Link></button>
      <button><Link to="/listen" className="navbar-link">listen</Link></button>
      </div>
      </div>
    );
  }
}

export default Splash;
