import { AccountRoute } from "@components/Routes/AccountRoute";
import { authorisedApiClient } from "@services/api/Index";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import { getCookie } from "@utils/CookieProvider";
import { AuthCookieKey } from "@constants/CookieConstants";
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { HomeRoute } from "../Routes/HomeRoute";
import { FourOhFour } from "./FourOhFour";

export const Dashboard = () => {
  const { setAppState } = AppContainer.useContainer();

  useEffectOnce(() => {
    const savedAuthCookie = getCookie(AuthCookieKey);
    if (savedAuthCookie) {
      (async () => {
        const user = await authorisedApiClient(
          savedAuthCookie
        ).authentication_GetUserInformationForToken(buildUserInfo());
        setAppState({ user: user, token: savedAuthCookie });
      })();
    }
  });

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
