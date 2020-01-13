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
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock">
          <Link to="/" className="Navbar-link">em7.io</Link>
        </div>
        <div className="NavBar-linkContainer u-inlineBlock">
          {this.props.userId && (
            <Link to={`/profile/${this.props.userId}`} className="NavBar-link">
              Profile
            </Link>
          )}
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
