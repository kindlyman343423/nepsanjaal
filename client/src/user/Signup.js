import React, { Component } from "react";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: ""
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };
    // console.log(user);
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(response => {
       console.log(JSON.stringify(response))
        return response.json();
      })
      .catch(err => console.log(err));
  };

  render() {
    const { name, email, password } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

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