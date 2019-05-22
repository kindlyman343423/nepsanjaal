import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
// import { authenticate } from "../../utils/Requests";

class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }

  responseGoogle = response => {
    console.log(response);
  };

  render() {
    // redirect
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }

    return (
      <GoogleLogin
        clientId="536882529164-244d3s32pucudrkd1akbmjhhiei2p5ok.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    );
  }
}

export default SocialLogin;
