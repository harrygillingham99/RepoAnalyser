import { AccountRoute } from "@components/Routes/AccountRoute";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { TestId } from "@tests/TestConstants";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { useLocation } from "react-router-dom";
import { HomeRoute } from "../Routes/HomeRoute";
import { FourOhFour } from "./FourOhFour";
import { Unauthorised } from "./Unauthorised";

export const Dashboard = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  const getDashboardForRoute = (route: Routes): JSX.Element => {
    if (!appState.user && AuthorizedRoutes.indexOf(route as Routes) >= 0) {
      return <Unauthorised />;
    }

    switch (route as Routes) {
      case Routes.Home:
        return <HomeRoute />;
      case Routes.Account:
        return <AccountRoute />;
      default:
        return <FourOhFour />;
    }
  };

  return (
    <div data-testid={TestId.Dashboard}>
      {getDashboardForRoute(pathname as Routes)}
    </div>
  );
};
