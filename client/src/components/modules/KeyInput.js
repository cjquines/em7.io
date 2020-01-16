import React, { Component } from "react";

/**
 * Input panel that changes the song key.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {string} defaultTonic: default parameter value
 * @param {string} defaultMode: default parameter value
 * @param {(Song) => void} onChange: (function) triggered when changing song parameter
 */
class KeyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tonic: this.props.defaultTonic,
      mode: this.props.defaultMode,
    };
  }

  handleTonicChange = (event) => {
    this.setState({tonic: event.target.value})
    const newKey = event.target.value + this.state.mode;
    const newSong = {...this.props.song, key: newKey};
    this.props.onChange(newSong);
  };

  handleModeChange = (event) => {
    this.setState({mode: event.target.value})
    const newKey = this.state.tonic + event.target.value;
    const newSong = {...this.props.song, key: newKey};
    this.props.onChange(newSong);
  };

  render() {
    return (
      <div className="KeyInput-container">
        Key
        <select value={this.state.tonic} onChange={this.handleTonicChange}>
          <option value="C">C</option>
          <option value="Db">C#/Db</option>
          <option value="D">D</option>
          <option value="Eb">D#/Eb</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="Gb">F#/Gb</option>
          <option value="G">G</option>
          <option value="Ab">G#/Ab</option>
          <option value="A">A</option>
          <option value="Bb">A#/Bb</option>
          <option value="B">B</option>
        </select>
        <select value={this.state.mode} onChange={this.handleModeChange}>
          <option value="">major</option>
          <option value="m">minor</option>
        </select>
      </div>
    );
  }
}

export default KeyInput;
