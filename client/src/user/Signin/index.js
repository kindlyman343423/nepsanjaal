import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import SigninForm from "./SigninForm";

import { signin, authenticate } from "../../utils/Requests";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false
    };
  }

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const user = {
      email,
      password
    };
    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  render() {
    const { error, redirectToReferer } = this.state;

    console.log(this.state);

    if (redirectToReferer) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">SignIn</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <SigninForm
          stateValues={this.state}
          handleChange={this.handleChange}
          clickSubmit={this.clickSubmit}
        />
      </div>
    );
  }
}

export default Signin;
