import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { ActivityRoute } from "./Activity/ActivityRoute";
import { DetailedPullRequestRoute } from "./PullRequests/DetailedPullRequestRoute";
import { PullRequestRoute } from "./PullRequests/PullRequestRoute";
import { DetailedRepositoryRoute } from "./Repositories/DetailedRepositoryRoute";
import { RepositoriesRoute } from "./Repositories/RepositoriesRoute";

export const HomeRoute = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  const buildRoute = (subPath: HomeSubRoutes) => `${Routes.Home}${subPath}`;

  const canViewRoute = (path: string) =>
    (appState.user === undefined && AuthorizedRoutes.indexOf(path) < 0) ||
    appState.user !== undefined;

  if (!canViewRoute(pathname)) return <Redirect to={Routes.Unauthorised} />;

  return (
    <Switch>
      <Route path={buildRoute(HomeSubRoutes.PullRequests)}>
        <PullRequestRoute />
      </Route>
      <Route path={buildRoute(HomeSubRoutes.Repositories)}>
        <RepositoriesRoute />
      </Route>
      <Route path={buildRoute(HomeSubRoutes.Activity)}>
        <ActivityRoute />
      </Route>
      <Route path={buildRoute(HomeSubRoutes.LandingPage)}>
        <DashboardHeader
          text={`Welcome ${appState?.user?.name ?? "please log in"}`}
        />
      </Route>
      <Route
        path={buildRoute(HomeSubRoutes.Repository)}
        component={DetailedRepositoryRoute}
      />
      <Route
        path={buildRoute(HomeSubRoutes.PullRequest)}
        component={DetailedPullRequestRoute}
      />
      <Route>
        <Redirect to={Routes.NotFound} />
      </Route>
    </Switch>
  );
};
