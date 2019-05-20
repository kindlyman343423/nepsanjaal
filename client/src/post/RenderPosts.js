import React from "react";
import { Link } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";
import base_url  from "../utils/Constants";

const RenderPosts = ({ posts }) => {
  return (
    <div className="row">
      {posts.map((post, i) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        return (
          <div className="card col-md-4" key={i}>
            <div className="card-body">
              <img
                src={`${base_url}/post/photo/${post._id}`}
                alt={post.title}
                onError={i => (i.target.src = `${DefaultPost}`)}
                className="img-thunbnail mb-3"
                style={{ height: "200px", width: "auto" }}
              />
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.body.substring(0, 100)}</p>
              <br />
              <p className="font-italic mark">
                Posted by <Link to={`${posterId}`}>{posterName} </Link>
                on {new Date(post.created).toDateString()}
              </p>
              <Link
                to={`/posts/${post._id}`}
                className="btn btn-raised btn-primary btn-sm"
              >
                Read more
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderPosts;
