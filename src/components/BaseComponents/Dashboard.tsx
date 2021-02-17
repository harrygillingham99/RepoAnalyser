import { AccountRoute } from "@components/Routes/AccountRoute";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { useLocation } from "react-router-dom";
import { HomeRoute } from "../Routes/HomeRoute";
import { FourOhFour } from "./FourOhFour";
import { Unauthorised } from "./Unauthorised";

export const Dashboard = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  if (!appState.user && AuthorizedRoutes.indexOf(pathname as Routes) >= 0) {
    return <Unauthorised />;
  }

  switch (pathname as Routes) {
    case Routes.Home:
      return <HomeRoute />;
    case Routes.Account:
      return <AccountRoute />;
    default:
      return <FourOhFour />;
  }
};
