import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, signout, removeUser } from "../../utils/Requests";

class DeleteUser extends Component {
  state = {
    redirect: false
  };

  deleteAccount = async () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    const data = await removeUser(userId, token);
    if (data.error) {
      console.log(data.error);
    } else {
      if (!isAuthenticated().user.role === "admin") {
        signout(() => console.log("User is deleted"));
      }

      // redirect
      this.setState({ redirect: true });
    }
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
