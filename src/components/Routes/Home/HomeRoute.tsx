import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { AuthorizedRoutes } from "@typeDefinitions/Routes";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { ActivityRoute } from "./Activity/ActivityRoute";
import { DetailedPullRequestRoute } from "./PullRequests/DetailedPullRequestRoute";
import { PullRequestRoute } from "./PullRequests/PullRequestRoute";
import { DetailedRepositoryRoute } from "./Repositories/DetailedRepositoryRoute";
import { RepositoriesRoute } from "./Repositories/RepositoriesRoute";

export const HomeRoute = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  const canViewRoute = (path: string) =>
    (appState.user === undefined && AuthorizedRoutes.indexOf(path as Routes) < 0) ||
    appState.user !== undefined;

  if (!canViewRoute(pathname)) return <Redirect to={Routes.Unauthorised} />;

  return (
    <Switch>
      <Route path={Routes.PullRequests}>
        <PullRequestRoute />
      </Route>
      <Route path={Routes.Repositories}>
        <RepositoriesRoute />
      </Route>
      <Route path={Routes.Activity}>
        <ActivityRoute />
      </Route>
      <Route path={Routes.Landing}>
        <DashboardHeader
          text={`Welcome ${appState?.user?.name ?? "please log in"}`}
        />
      </Route>
      <Route
        path={Routes.Repository}
        component={DetailedRepositoryRoute}
      />
      <Route
        path={Routes.PullRequest}
        component={DetailedPullRequestRoute}
      />
      <Route>
        <Redirect to={Routes.NotFound} />
      </Route>
    </Switch>
  );
};
