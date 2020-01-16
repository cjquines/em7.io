import React, { Component } from "react";

/**
 * Input panel that changes the song key signature.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {number} defaultUpper: default lower value
 * @param {number} defaultLower: default upper value
 * @param {(Song) => void} onChange: (function) triggered when changing song parameter
 */
class SignatureInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upper: this.props.defaultUpper,
      lower: this.props.defaultLower,
    };

    this.handleUpperChange = this.handleUpperChange.bind(this);
    this.handleLowerChange = this.handleLowerChange.bind(this);
  }

  handleUpperChange(event) {
    this.setState({upper: event.target.value})
    const newSignature = [event.target.value, this.state.lower];
    const newSong = {...this.props.song, signature: newSignature};
    this.props.onChange(newSong);
  }

  handleLowerChange(event) {
    this.setState({lower: event.target.value})
    const newSignature = [this.state.upper, event.target.value];
    const newSong = {...this.props.song, signature: newSignature};
    this.props.onChange(newSong);
  }

  render() {
    return (
      <div className="SignatureInput-container">
        Time signature
        <select value={this.state.upper} onChange={this.handleUpperChange}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
        <select value={this.state.lower} onChange={this.handleLowerChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="16">16</option>
          <option value="32">32</option>
        </select>
      </div>
    );
  }
}

export default SignatureInput;
