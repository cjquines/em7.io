import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
import "./Profile.css";
import "../../utilities.css";
import SongBlock from "../modules/SongBlock.js"


/**
 * Profile is the user's profile page.
 */
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      songList: [],
    }
  }

  componentDidMount() { 
    document.title = "Profile Page";
    get(`/api/user`, { userId: this.props.userId }).then((user) => {
      console.log("got user!");
      this.setState({ user : user });
    });
    get(`/api/songs`, { creator_id: this.props.userId }).then((songList) => {
      this.setState({ songList: songList }),
      console.log(`Received ${songList.length} songs`)
      console.log(songList)
      console.log(this.state.songList)
    });
  }

  render() {
    let displayedList = null;
    if (!this.state.user) {
      return <div>Loading...</div>;
    }
    else {
      displayedList = this.state.songList.map((aSong) =>
      <SongBlock
        song_id = {aSong._id}
        creator_id = {aSong.creator_id}
        name = {aSong.name}/>)
    }
    return (
      <div className = "profile-container">
        <h1 className="profile-name u-textCenter">{this.state.user.name}'s songs</h1>
        <div className="grid-container">{displayedList}
        </div>
      </div>
    );
  }
}

export default Profile;
