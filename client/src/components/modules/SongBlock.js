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
    console.log(user._id);
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
        {this.props.is_owner &&
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
        
          </>)
        }
      </div>
      </Link>
    )
  }
}

export default SongBlock;
