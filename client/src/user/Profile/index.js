import React, { Component } from "react";
import { isAuthenticated, getProfile } from "../../utils/Requests";
import { Redirect } from "react-router-dom";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false
    };
  }

  init = async userId => {
    const token = isAuthenticated().token;
    const data = await getProfile(userId, token);
    if (data.error) {
      this.setState({ redirectToSignin: true });
    } else {
      this.setState({ user: data });
    }
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  render() {
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin || !isAuthenticated())
      return <Redirect to="/signin" />;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <p>Hello {isAuthenticated().user.name}</p>
        <p>Email: {isAuthenticated().user.mail}</p>
        <p>{`Joined ${new Date(this.state.user.created).toDateString()}`}</p>
      </div>
    );
  }
}

export default Profile;
