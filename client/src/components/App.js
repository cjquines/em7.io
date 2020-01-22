import React, { Component } from "react";
import { Router } from "@reach/router";

import Compose from "./pages/Compose.js";
import Harmonize from "./pages/Harmonize.js";
import Listen from "./pages/Listen.js";
import NavBar from "./modules/NavBar.js";
import NotFound from "./pages/NotFound.js";
import Profile from "./pages/Profile.js";
import Splash from "./pages/Splash.js";
import { get, post } from "../utilities";

import "../utilities.css";

/**
 * App is the main container for the website.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <div className="App-container">
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        <div className="App-body">
          <Router>
            <Splash path="/" />
            <Compose path="/compose" />
            <Harmonize path="/harmonize/:songId" />
            <Listen path="/listen" />
            <Profile path="/profile/:userId" />
            <NotFound default />
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
