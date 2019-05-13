import React from "react";
import { Link } from "react-router-dom";

const RenderUsers = ({ users, DefaultProfile }) => {
  return (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            className="card-img-top"
            src={DefaultProfile}
            alt={user.name}
            style={{
              width: "100%",
              height: "15vw",
              objectFit: "cover"
            }}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderUsers;
