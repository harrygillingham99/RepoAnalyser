import { AppContainer } from "@state/AppState";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { FourOhFour } from "./FourOhFour";

export const Dashboard = () => {
  const { state } = AppContainer.useContainer();
  return (
    <Switch>
      <Route path={Routes.Home}>
        <div>
          <p>logged in: {state.token ?? "nope"}</p>
        </div>
      </Route>
      <Route>
        <FourOhFour />
      </Route>
    </Switch>
  );
};
