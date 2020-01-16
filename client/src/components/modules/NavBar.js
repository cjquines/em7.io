import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

// TODO: write NavBar css
// import "./NavBar.css";

// TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * NavBar is the NavBar at the top of each page.
 *
 * Proptypes
 * @param {(res) => void} handleLogin: (function) triggered when login
 * @param {() => void} handleLogout: (function) triggered when logout
 * @param {string} userId: the user ID
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar-container">
        <div>
        <div className="navbar-title u-inlineBlock">
          <Link to="/" className="navbar-link">em7.io</Link>
        </div>
        <div className="navbar-linkContainer u-inlineBlock">
          {this.props.userId && (
            <Link to={`/profile/${this.props.userId}`} className="navbar-link">
              Profile
            </Link>
          )}
        </div>
        </div>
        <div>
          <div className="u-inlineBlock">
            <Link to="/" className="navbar-link">Help</Link>
          </div>
          <div className="u-inlineBlock">
            <Link to="/" className="navbar-link">Preferences</Link>
          </div>
          <div className="u-inlineBlock">
            {this.props.userId ? (
              <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.props.handleLogout}
                onFailure={(err) => console.log(err)}
                className="navbar-link navbar-login"
              />
            ) : (
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={this.props.handleLogin}
                onFailure={(err) => console.log(err)}
                className="navbar-link navbar-login"
              />
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
