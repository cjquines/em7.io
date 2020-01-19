import React, { Component } from "react";
import "./Dialogue.css";
import "../../utilities.css"
import "../pages/Splash.css"

/**
 * Input panel that changes the song tempo.
 *
 * Proptypes
 * @param closingFunction
 * @param display
 * @param title
 */
class Dialogue extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.display ? 
      <div class="modal">
      <form action="/action_page.php" className="modal-content">
      <div class="formContainer">
      <h1>Save</h1>
        <h2>Name</h2>
        <input className="formInput" type="text" value={this.props.title} name="title" required />

        <h2>Password</h2>
        <input className="formInput" type="text" placeholder="Add Tags" name="title" required />

        <div className="splash-button-container">
        <button type="button" className="greyButton" onClick={this.props.closingFunction}>Cancel</button>
        <button type="submit" className="goodButton" onClick={this.props.closingFunction}>Save</button>
        </div>
      </div>
      </form>
      </div>
      : (null)
    );
  }
}

export default Dialogue;
