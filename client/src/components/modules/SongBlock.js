import React, { Component } from "react";
import { Link } from "@reach/router";

import "./SongBlock.css"
import "../../utilities.css"

class SongBlock extends Component {

  /**
   * 
   * @param {String} song_id
   * @param {String} name
   * @param {String} creator_id
   */
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    console.log(this.props)
    return (
      <Link to={`/listen/${this.props.song_id}`}>
      <div className = "smallSongContainer">
        <div className = "smallSongTitle">{this.props.name}</div>
        {
        this.props.keys.includes('m') ?
          <div className = "smallSongSubtitle">{this.props.keys.replace('m','')+ " minor"}</div>
        :
          <div className = "smallSongSubtitle">{this.props.keys+ " major"}</div>
        }
        {(user._id === this.props.creator_id)
          (<>
          <Link to={`/compose/${this.props.song_id}`}>
            <button type="button" className="greyButton">
              Edit
            </button>
          </Link>
          <Link to={`/harmonize/${this.props.song_id}`}>
            <button type="button" className="greyButton">
              Reharmonize
            </button>
          </Link>
          // <button type="button" className="greyButton" onClick={this.delete}}>Delete</button>
          </>)
        }
      </div>
      </Link>
    )
  }
}

export default SongBlock;
