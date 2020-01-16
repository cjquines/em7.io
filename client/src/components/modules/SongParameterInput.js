import React, { Component } from "react";
import Song from "../common/Song.js";

/**
 * Input panel that changes the tempo, key, and time singature.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {string} parameter: the parameter this changes
 * @param {string} text: the text of this parameter
 * @param {string} defaultValue: default parameter value
 * @param {(Song) => void} onChange: (function) triggered when changing song parameter
 */
class SongParameterInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.defaultValue };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    const newSong = {...this.props.song, [this.props.parameter]: event.target.value};
    this.props.onChange(newSong);
  }

  render() {
    return (
      <div className="SongParameterInput-container">
      {this.props.text}
      <input
        type="text"
        placeholder={this.props.defaultValue}
        value={this.state.value}
        onChange={this.handleChange}
      />
      </div>
    );
  }
}

export default SongParameterInput;
