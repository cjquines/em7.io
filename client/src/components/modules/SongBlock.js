import React, { Component } from "react";
import { Link } from "@reach/router";

import "./SongBlock.css"
import "../../utilities.css"
import { post } from "../../utilities.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faGuitar } from '@fortawesome/free-solid-svg-icons'

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
          (<><div className = "songBlockLinkContainer">
          <Link className = "songBlockLink" to={`/compose/${this.props.song_id}`}>
            <span className="songBlockLinkTooltip">Edit</span>
            <FontAwesomeIcon icon = {faEdit}/>
          </Link>
          <Link className = "songBlockLink"to={`/harmonize/${this.props.song_id}`}>
            <span className="songBlockLinkTooltip">Reharmonize</span>
            <FontAwesomeIcon icon = {faGuitar}/>
          </Link>
          
          <Link className = "songBlockLink" onClick = {this.delete} to={`/profile/${this.props.creator_id}`}>
            <span className="songBlockLinkTooltip" >Delete</span>
            <FontAwesomeIcon icon = {faTrashAlt}/>
          </Link> </div></>)
        }
      </div>
      </Link>
    )
  }
}

export default SongBlock;
