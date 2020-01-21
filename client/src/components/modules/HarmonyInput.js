import React, { Component } from "react";

/**
 * Input panel that changes the song tempo.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {number} snapInterval: the snap interval
 * @param {number} defaultTempo: default tempo
 * @param {(Song) => void} onChange: (function) triggered when changing song parameter
 */
class HarmonyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {harmonyOption : 1};
  }

  handleHarmonyChange = (event) => {
    this.setState({harmonyOption: event.target.value}),
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <div className="TempoInput-container">
        Amount of Harmony Options: {this.props.harmonyChords}
        <input value={this.props.harmonyOption} type="number" min="1" max= {this.props.harmonyChords} onChange={this.handleHarmonyChange}/>
      </div>
    );
  }
}

export default HarmonyInput;
