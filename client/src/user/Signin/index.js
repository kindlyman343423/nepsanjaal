import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import SigninForm from "./SigninForm";

import { signin, authenticate } from "../../utils/Requests";
import SocialLogin from "./SocialLogin";
import { handleRecaptcha } from "../../utils/helpers";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
      recaptcha: false
    };
  }

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };

  recaptchaHandler = e => {
    let recaptcha = handleRecaptcha(e);
    this.setState({ recaptcha});
  };

  clickSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    if (this.state.recaptcha) {
      const data = await signin(user);
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    } else {
      this.setState({
        error: "What day is today? Please write a correct answer!", loading: false
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
        <hr />
        <SocialLogin />

        <hr />
        <br />
        <br />

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <SigninForm
              stateValues={this.state}
              handleChange={this.handleChange}
              clickSubmit={this.clickSubmit}
              recaptchaHandler={this.recaptchaHandler}
            />
            <p>
              <Link to="/forgot-password" className="btn btn-raised btn-danger">
                {" "}
                Forgot Password
              </Link>
            </p>
          </>
        )}
      </div>
    );
  }
}

export default Signin;
