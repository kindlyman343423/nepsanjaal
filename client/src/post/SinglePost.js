import React, { Component } from "react";
import {
  getPostById,
  isAuthenticated,
  removePost,
  like,
  unlike
} from "../utils/Requests";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import appconstants from "../utils/Constants";

import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    liked: false,
    likes: 0,
    comments: []
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    getPostById(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          liked: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.liked ? unlike : like;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          liked: !this.state.liked,
          likes: data.likes.length
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  handledeletePost = () => {
    let answer = window.confirm("Are you sure you want to delete this post?");
    if (answer) {
      const postId = this.props.match.params.postId;
      const token = isAuthenticated().token;
      removePost(postId, token).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ redirectToHome: true });
        }
      });
    }
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    const { likes, liked } = this.state;

    return (
      <div className="card-body">
        <img
          src={`${appconstants.base_url}/post/photo/${
            post._id
          }?${new Date().getTime()}`}
          alt={post.title}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thunbnail mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover"
          }}
        />

        <p className="card-text">{post.body}</p>
        <br />
        {liked ? (
          <h3 onClick={this.likeToggle}>
            <i
              className="fa fa-thumbs-up text-success bg-dark"
              style={{
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer"
              }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={this.likeToggle}>
            <i
              className="fa fa-thumbs-up text-warning bg-dark"
              style={{
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer"
              }}
            />{" "}
            {likes} Like
          </h3>
        )}
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>

                <button
                  onClick={this.handledeletePost}
                  className="btn btn-raised btn-danger"
                >
                  Delete Post
                </button>
              </>
            )}
          <div>
            {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
              <div className="card mt-5">
                <div className="card-body">
                  <h5 className="card-title">Admin</h5>
                  <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.handledeletePost}
                    className="btn btn-raised btn-danger"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
