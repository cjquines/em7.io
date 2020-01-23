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
                <div className = "smallSongSubtitle">{this.props.song_id}</div>
                {/* TODO: make these make a DUPLICATE of the original rather than editing the original*/}
                <Link to={`/compose/${this.props.song_id}`}>Edit</Link>
                <Link to={`/harmonize/${this.props.song_id}`}>Reharmonize</Link>
            </div>
            </Link>
        )
    }
}

export default SongBlock;
