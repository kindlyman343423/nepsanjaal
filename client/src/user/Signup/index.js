import React, { Component } from "react";
import { signup } from "../../utils/Requests";
import SignupForm from "./SignupForm";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
    };
  }

  handleChange = event => {
    this.setState({error: "", open: false});
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

    const data = await signup(user);
    if (data.error) this.setState({ error: data.error });
    else
      this.setState({
        error: "",
        name: "",
        email: "",
        password: "",
        open: true
      });
  };

  render() {
    const { error, open } = this.state;
    console.log(this.state);
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

        {error && 
         <div className="alert alert-danger">{error}</div>
        }

        {open && 
         <div className="alert alert-success">Successfully created account</div>
        }
       <SignupForm 
        stateValues = {this.state}
        handleChange={this.handleChange}
        clickSubmit={this.clickSubmit}
       />
      </div>
    );
  }
}

export default Signup;
