import { AccountRoute } from "@components/Routes/Account/AccountRoute";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { TestId } from "@tests/TestConstants";
import { Routes } from "@typeDefinitions/Routes";
import { splitPath } from "@utils/Urls";
import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { HomeRoute } from "../Routes/Home/HomeRoute";

export const Dashboard = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  const getDashboardForRoute = (route: Routes | undefined): JSX.Element => {
    if (!appState.user && AuthorizedRoutes.indexOf(route as Routes) >= 0) {
      return <Redirect to={Routes.Unauthorised} />;
    }
    switch (route as Routes) {
      case Routes.Home:
        return <HomeRoute />;
      case Routes.Account:
        return <AccountRoute />;
      default:
        return <Redirect to={Routes.NotFound} />;
    }
  };

  return (
    <div data-testid={TestId.Dashboard}>
      {getDashboardForRoute(splitPath(pathname) as Routes)}
    </div>
  );
};
