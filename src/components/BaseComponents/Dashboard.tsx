import { AccountRoute } from "@components/Routes/AccountRoute";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { useLocation } from "react-router-dom";
import { HomeRoute } from "../Routes/HomeRoute";
import { FourOhFour } from "./FourOhFour";

export const Dashboard = () => {
  const { pathname } = useLocation();

  switch (pathname as Routes) {
    case Routes.Home:
      return <HomeRoute />;
    case Routes.Account:
      return <AccountRoute />;
    default:
      return <FourOhFour />;
  }
};
