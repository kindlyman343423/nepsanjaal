import React, { Component } from "react";
import { getAllUsers } from "../../utils/Requests";
import DefaultProfile from "../../images/avatar.jpg";
import RenderUsers from "./RenderUsers";
class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    getAllUsers().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        <RenderUsers users={users} DefaultProfile={DefaultProfile} />
      </div>
    );
  }
}

export default Users;
