import React, { Component } from "react";
import {
  isAuthenticated,
  getUserById,
  updateUser,
  getProfileImage
} from "../../utils/Requests";
import EditForm from "./_EditForm";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = async userId => {
    const token = isAuthenticated().token;
    const data = await getUserById(userId, token);
    if (data.error) {
      this.setState({ redirectToSignin: true });
    } else {
      this.setState({
        id: data._id,
        name: data.name,
        email: data.email,
        error: ""
      });
    }
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid Email is required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = event => {
    this.setState({ error: "" });
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    const fileSize =
      event.target.name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(event.target.name, value);
    this.setState({ [event.target.name]: value, fileSize });
  };

  clickSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      const data = await updateUser(userId, token, this.userData);
      if (data.error) this.setState({ error: data.error, loading: false });
      else
        this.setState({
          redirectToProfile: true
        });
    }
  };

  render() {
    const { id, name } = this.state;

    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${this.state.id}`} />;
    }

    const photoUrl = id
      ? getProfileImage(id)
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>

        {this.state.error && (
          <div className="alert alert-danger">{this.state.error}</div>
        )}
        {this.state.loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <img
              style={{ height: "200px", width: "auto" }}
              className="img-thumbnail"
              src={photoUrl}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={name}
            />
            <EditForm
              stateValues={this.state}
              handleChange={this.handleChange}
              clickSubmit={this.clickSubmit}
            />
          </>
        )}
      </div>
    );
  }
}

export default EditProfile;
