import React, { Component } from "react";
import { Link } from "@reach/router";

import "./SongBlock.css"
import "../../utilities.css"
import { post } from "../../utilities.js"
import Dialogue from "../modules/Dialogue.js";
class SongBlock extends Component {

  /**
   * 
   * @param {String} song_id
   * @param {String} name
   * @param {String} creator_id
   */
  constructor(props) {
    super(props);
    this.state = {
        deleted : false
    }
  }

  componentDidMount() { }


  delete = () => {
      if(confirm("Are you sure you want to delete this song?")){
      this.setState({deleted : true})
    post("/api/song/delete", { song_id: this.props.song_id }).then((response) => {
      console.log(response);
    });
    }
    else {
        
    }

  };

  render() {
    if(this.state.deleted){
        return ("");
    }
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
          <Link to={`/profile/${this.props.creator_id}`}>
          <button type="button" className="greyButton" onClick={this.delete}>
            Delete
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
