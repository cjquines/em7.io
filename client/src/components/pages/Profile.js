import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";

import "../../utilities.css";


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
    get(`/api/user`, { userid: this.props.userId }).then((user) => {
      console.log("got user!");
      this.setState({ user : user });
    });
    get(`/api/songs`, { creator_id: this.props.userId }).then((songList) => {
        this.setState({ songList: songList }),
        console.log(`Received ${songList.length} songs`)
    });

        
   

      }


  


  render() {
    if (!this.state.user) {
      return <div> Loading! </div>;
    }
    return (
      <div>
      {this.state.user}'s songs:

      {this.state.songList}
      </div>
    );
  }
}

export default Profile;
