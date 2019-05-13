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
      redirectToProfile: false
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
        email: data.email
      });
    }
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clickSubmit = async event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };

    const userId = this.props.match.params.userId;
    const token = isAuthenticated().token;
    
    const data = await updateUser(userId, token, user);
    if (data.error) this.setState({ error: data.error });
    else
      this.setState({
        redirectToProfile: true
      });
  };

  render() {
    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${this.state.id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>

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
