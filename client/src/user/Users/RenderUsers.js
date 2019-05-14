import React from "react";
import { Link } from "react-router-dom";
import { getProfileImage } from "../../utils/Requests";

const RenderUsers = ({ users, DefaultProfile }) => {
  return (
    <div className="row">
      {users.map((user, i) => {
        let photoUrl = user._id ? getProfileImage(user._id) : DefaultProfile;

        return (
          <div className="card col-md-4" key={i}>
            <img
              className="card-img-top"
              src={photoUrl}
              alt={user.name}
              style={{
                width: "100%",
                height: "15vw",
                objectFit: "cover"
              }}
              onError={i => (i.target.src = `${DefaultProfile}`)}
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
        );
      })}
    </div>
  );
};

export default RenderUsers;
