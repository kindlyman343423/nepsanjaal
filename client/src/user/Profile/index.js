import React, { Component } from "react";
import {
  isAuthenticated,
  getProfile,
  getProfileImage,
  getPostByUser
} from "../../utils/Requests";
import { Redirect, Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import DeleteUser from "./DeleteProfile";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    };
  }

  init = async userId => {
    const token = isAuthenticated().token;
    const data = await getProfile(userId, token);
    if (data.error) {
      this.setState({ redirectToSignin: true });
    } else {
      let following = this.checkFollow(data);
      this.setState({ user: data, following });
      this.loadPosts(data._id);
    }
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    getPostByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = callApi => {
    const token = isAuthenticated().token;

    callApi(token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  render() {
    const { redirectToSignin, user, posts } = this.state;
    if (redirectToSignin || !isAuthenticated())
      return <Redirect to="/signin" />;

    const photoUrl = user._id ? getProfileImage(user._id) : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <img
              className="card-img-top"
              src={photoUrl}
              alt={user.name}
              style={{
                width: "100%",
                height: "15vw",
                objectFit: "cover"
              }}
              onError={i => (i.target.src = `${DefaultProfile}`)}
            />
          </div>

          <div className="col-md-6">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
