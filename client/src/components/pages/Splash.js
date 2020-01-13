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
      splash page
      <Link to="/compose">compose</Link>
      <Link to="/listen">listen</Link>
      </div>
    );
  }
}

export default Splash;
