import React, { Component } from "react";
import Posts from '../post/Posts';

export default class Home extends Component {
  render() {
    return (
      <div>
      <div className="jumbotron">
        <h1>Home</h1>
        <p className="lead">Welcome to the react frontend</p>
      </div>
      <div className="container">
            <Posts />
        </div>
      </div>
    );
  }
}
