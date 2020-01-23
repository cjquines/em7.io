import React, { Component } from "react";
import { Link } from "@reach/router";

import "./SingleSong.css"
import "../../utilities.css"

class SingleSong extends Component {

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
            </div>
            </Link>
        )
    }
}

export default SingleSong;
