import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "../src/user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";

const MainRouter = () => {
  return (
    <>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/user/:userId" component={Profile} />
      </Switch>
    </>
  );
};

export default MainRouter;
