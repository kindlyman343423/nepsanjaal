import React, { Component } from "react";
import { getPostById, isAuthenticated, removePost } from "../utils/Requests";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import appconstants from "../utils/Constants";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    getPostById(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
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

    return (
      <div className="card-body">
        <img
          src={`${appconstants.base_url}/post/photo/${post._id}?${new Date().getTime()}`}
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
        </div>
      </div>
    );
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }
    const { post } = this.state;
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
      </div>
    );
  }
}

export default SinglePost;
