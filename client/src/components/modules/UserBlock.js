import React, { Component } from "react";
import { Link } from "@reach/router";

import "./SongBlock.css"
import "../../utilities.css"

class UserBlock extends Component {

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
            <Link to={`/profile/${this.props.id}`}>
            <div className = "smallSongContainer">
                <div className = "smallSongTitle">{this.props.name}</div>
                <div className = "smallSongSubtitle">{this.props.song_id}</div>
                {/* TODO: make these make a DUPLICATE of the original rather than editing the original*/}
            </div>
            </Link>
        )
    }
}

export default UserBlock;
