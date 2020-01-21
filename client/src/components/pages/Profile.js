import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
import "./Profile.css";
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
      this.setState({ user : user[0] });
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
      <h1 className="Profile-name u-textCenter">{this.state.user.name}'s songs</h1>

      </div>
    );
  }
}

export default Profile;
