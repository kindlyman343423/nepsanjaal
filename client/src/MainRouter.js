import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./core/Home";

const MainRouter = () => {
  return (
    <Switch>
      <Route to="/" component={Home} />
    </Switch>
  );
};

export default MainRouter;
