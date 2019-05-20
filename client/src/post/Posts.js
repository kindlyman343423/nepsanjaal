import React, { Component } from "react";
import { postList } from "../utils/Requests";
import RenderPosts from "./RenderPosts";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    postList().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Recent Posts</h2>

        <RenderPosts posts={posts} />
      </div>
    );
  }
}

export default Posts;
