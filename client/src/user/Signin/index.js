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
      redirectToReferer: false,
      loading: false
    };
  }

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };

  clickSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    const data = await signin(user);
    if (data.error) {
      this.setState({ error: data.error, loading: false });
    } else {
      // authenticate
      authenticate(data, () => {
        this.setState({ redirectToReferer: true });
      });
    }
  };

  render() {
    const { error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">SignIn</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : 
        <SigninForm
          stateValues={this.state}
          handleChange={this.handleChange}
          clickSubmit={this.clickSubmit}
        />
        }
      </div>
    );
  }
}

export default Signin;
