import React from "react";
import { Link } from "react-router-dom";

const RenderPosts = ({posts}) => {
  return (
    <div className="row">
      {posts.map((post, i) => (
        <div className="card col-md-4" key={i}>
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.body}</p>
            <Link
              to={`/posts/${post._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              Read more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RenderPosts;