import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "../src/user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import EditProfile from "./user/Profile/EditProfile";
import Users from "./user/Users";

const MainRouter = () => {
  return (
    <>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/user/:userId" component={Profile} />
        <Route exact path="/user/edit/:userId" component={EditProfile} />
      </Switch>
    </>
  );
};

export default MainRouter;
