import React, { Component } from "react";

/**
 * Input panel that changes the song tempo.
 *
 * Proptypes
 * @param {Song} song: the song that we're changing parameters of
 * @param {number} defaultTempo: default tempo
 * @param {(Song) => void} onChange: (function) triggered when changing song parameter
 */
class TempoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempo: this.props.defaultTempo,
    };
  }

  handleTempoChange = (event) => {
    this.setState({tempo: event.target.value})
    const newSong = {...this.props.song, tempo: event.target.value};
    this.props.onChange(newSong);
  };

  render() {
    return (
      <div className="TempoInput-container">
        Tempo
        <input value={this.state.tempo} type="number" min="30" max="300" onChange={this.handleTempoChange}/>
      </div>
    );
  }
}

export default TempoInput;
