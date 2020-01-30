import React, { Component } from "react";
import "./Dialogue.css";
import "../../utilities.css"
import "../pages/Splash.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'


/**
 * Input panel that changes the song tempo.
 *
 * Proptypes
 * @param closeFunction
 * @param display
 * @param title
 * @param saveFunction
 */
class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {feedback: ""};
  }

  handleInputChange = (event) => {
    this.setState({feedback: event.target.value}),
    console.log((this.state.feedback.length==0))
  };

  sendMessage = () => {
    body = {
      content: this.state.feedback,
    }
    post("/api/text", body).then((response) => {
      console.log(response);
    });
  }

  render() {
    return (
      this.props.display ? 
      <div className="modal">
        <form className="help-modal-content">
          <div className="helpFormContainer" style={{fontWeight: 300}}>
          <FontAwesomeIcon icon = {faTimes} style={{float: "right", fontSize: 20+"px", color: "#444", cursor: "pointer"}} onClick = {this.props.closingFunction}/>
            <h2>Welcome to em7.io!</h2>
            <p>Create songs and share them with your friends!<br></br>To get started, select <b style={{fontWeight:400}}>Compose</b>. Play a simple melody on your keyboard, adjust the notes, and select a harmony.
            <br></br>You can find songs other people created through the <b style={{fontWeight:400}}>Listen</b> page.</p>
        
            <h4>Report an Issue</h4>
            <p>If you encounter issues with our website,<br></br>
                please tell us about them here!</p>
                <div className="save-button-container" style = {{justifyContent: "flex-end", marginTop: "24px", marginRight: "-12px"}}>
                <input className="formInput" type="text" onChange={this.handleInputChange}/>
            <button type="submit" className="checkButton" onClick={this.sendMessage}><FontAwesomeIcon icon = {faCheck} style={{display:(this.state.feedback.length==0)}}/></button>
            </div>
          </div>
        </form>
      </div>
      : (null)
    );
  }
}

export default Help;
