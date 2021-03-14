import { SettingsRoute } from "@components/Routes/Settings/SettingsRoute";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { TestId } from "@tests/TestConstants";
import { Routes } from "@typeDefinitions/Routes";
import { splitPath } from "@utils/Urls";
import { Redirect, useLocation } from "react-router-dom";
import { HomeRoute } from "../Routes/Home/HomeRoute";
import { Loader } from "./Loader";

export const Dashboard = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();
  const { loading } = appState;

  const getDashboardForRoute = (route: Routes | undefined): JSX.Element => {
    if (loading) return <Loader />;

    if (!appState.user && AuthorizedRoutes.indexOf(pathname) >= 0) {
      return <Redirect to={Routes.Unauthorised} />;
    }

    switch (route as Routes) {
      case Routes.Home:
        return <HomeRoute />;
      case Routes.Settings:
        return <SettingsRoute />;
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
