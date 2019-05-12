import React, { Component } from "react";
import { signup } from "../utils/Requests";

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
    const { name, email, password, error, open } = this.state;
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
        <form>
          <div className="form-group">
            <label className="text-muted">Name</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="name"
              className="form-control"
              value={name}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              onChange={this.handleChange}
              type="email"
              name="email"
              className="form-control"
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={this.handleChange}
              type="password"
              name="password"
              className="form-control"
              value={password}
            />
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Signup;
