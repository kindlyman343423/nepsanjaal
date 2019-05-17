import React, { Component } from "react";
import { isAuthenticated, follow, findPeople } from "../../utils/Requests";
import RenderUsers from "./RenderUsers";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  clickFollow = (user, i) => {
    const token = isAuthenticated().token;

    follow(token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Find People</h2>

        {open && <div className="alert alert-success">{followMessage}</div>}

        <RenderUsers clickFollow={this.clickFollow} users={users} />
      </div>
    );
  }
}

export default FindPeople;
