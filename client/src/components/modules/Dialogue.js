import React, { Component } from "react";
import "./Dialogue.css";
import "../../utilities.css"
import "../pages/Splash.css"

/**
 * Input panel that changes the song tempo.
 *
 * Proptypes
 * @param closeFunction
 * @param display
 * @param title
 * @param saveFunction
 */
class Dialogue extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.display ? 
      <div class="modal">
        <form className="modal-content">
          <div class="formContainer">
            <h2>Name</h2>
            <input className="formInput" type="text" value={this.props.title} name="title" required />
            <div className="save-button-container" style = {{justifyContent: "flex-end", marginTop: "24px", marginRight: "-12px"}}>
            <button type="button" className="greyButton" onClick={this.props.closeFunction}>Cancel</button>
            <button type="submit" className="goodButton" onClick={this.props.saveFunction}>Save</button>
            </div>
          </div>
        </form>
      </div>
      : (null)
    );
  }
}

export default Dialogue;
