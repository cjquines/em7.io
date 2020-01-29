import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

// TODO: write NavBar css
// import "./NavBar.css";

// TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "500052314351-0etpe2e520de1vf9121pb37fscm9t52o.apps.googleusercontent.com";

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
        <div className="navbar-subcontainer">
          <div className="navbar-title u-inlineBlock">
            <Link to="/" className="navbar-link">Home</Link>
          </div>
          {/* <div className="navbar-linkContainer u-inlineBlock">
            {this.props.userId && (
              <Link to={`/profile/${this.props.userId}`} className="navbar-link">
                Profile
              </Link>
            )}
          </div> */}
        </div>
        <div className="navbar-subcontainer">
        <div className="navbar-linkContainer u-inlineBlock">
            {this.props.userId && (
              <Link to={`/profile/${this.props.userId}`} className="navbar-link">
                Profile
              </Link>
            )}
          </div>
          {/* <div className="u-inlineBlock">
            <Link to="/" className="navbar-link">Help</Link>
          </div>
          <div className="u-inlineBlock">
            <Link to="/" className="navbar-link">Preferences</Link>
          </div> */}
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
