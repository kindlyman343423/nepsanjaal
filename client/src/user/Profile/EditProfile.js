import React, { Component } from "react";
import { isAuthenticated, getUserById, updateUser } from "../../utils/Requests";
import EditForm from "./_EditForm";
import { Redirect } from "react-router-dom";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: ""
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
    const { name, email, password } = this.state;
    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid Email is required" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long"
      });
      return false;
    }
    return true;
  };

  handleChange = event => {
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    this.userData.set(event.target.name, value);
    this.setState({ [event.target.name]: value });
  };

  clickSubmit = async event => {
    event.preventDefault();

    if (this.isValid()) {
      const { name, email, password } = this.state;
      const user = {
        name,
        email,
        password: password || undefined
      };

      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      const data = await updateUser(userId, token, this.userData);
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          redirectToProfile: true
        });
    }
  };

  render() {
    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${this.state.id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>

        {this.state.error && (
          <div className="alert alert-danger">{this.state.error}</div>
        )}

        <EditForm
          stateValues={this.state}
          handleChange={this.handleChange}
          clickSubmit={this.clickSubmit}
        />
      </div>
    );
  }
}

export default EditProfile;
