import React, { Component } from "react";

/**
 * Input panel that changes the snap interval.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {string} defaultValue: default value
 * @param {(number) => void} onChange: (function) triggered when changing snap interval
 */
class SnapIntervalInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue,
    };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value})
    const newSnapInterval = 60000/this.props.song.tempo*event.target.value;
    this.props.onChange(newSnapInterval);
  };

  render() {
    return (
      <div className="SnapIntervalInput-container">
        Snap interval
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="0.0625">1/16 beat</option>
          <option value="0.125">1/8 beat</option>
          <option value="0.25">1/4 beat</option>
          <option value="0.5">1/2 beat</option>
          <option value="1">1 beat</option>
        </select>
      </div>
    );
  }
}

export default SnapIntervalInput;
