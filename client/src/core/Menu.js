import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../utils/Requests";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  else return { color: "#ffffff" };
};

const renderLinks = history =>
  !isAuthenticated() ? (
    <>
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/signin")}
          to="/signin"
        >
          Sign In
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/signup")}
          to="/signup"
        >
          Sign Up
        </Link>
      </li>
    </>
  ) : (
    <>
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <a
          href={" "}
          className="nav-link"
          style={
            (isActive(history, "/signup"), { cursor: "pointer", color: "#fff" })
          }
          onClick={() => signout(() => history.push("/"))}
        >
          Sign Out
        </a>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`}>
          {isAuthenticated().user.name + "'s Profile"}
        </Link>
      </li>
    </>
  );

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">{renderLinks(history)}</ul>
  </div>
);

export default withRouter(Menu);
