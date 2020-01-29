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
    this.state = {value: this.props.title};
  }

  handleTitleChange = (event) => {
    this.setState({value: event.target.value}),
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      this.props.display ? 
      <div className="modal">
        <form className="modal-content">
          <div className="formContainer">
            <h2>Name</h2>
            <input className="formInput" type="text" value={this.state.value} name="title" onChange={this.handleTitleChange} />
            <div className="save-button-container" style = {{justifyContent: "flex-end", marginTop: "24px", marginRight: "-12px"}}>
            <button type="button" className="greyButton" onClick={this.props.closingFunction}>Cancel</button>
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
