import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { HomeRoute } from "../Routes/HomeRoute";
import { FourOhFour } from "./FourOhFour";

export const Dashboard = () => {
  return (
    <Switch>
      <Route path={Routes.Home}>
        <HomeRoute />
      </Route>
      <Route>
        <FourOhFour />
      </Route>
    </Switch>
  );
};
