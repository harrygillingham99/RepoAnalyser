import { AuthorizedRoutes } from "@typeDefinitions/Routes";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { ActivityRoute } from "./Activity/ActivityRoute";
import { DetailedPullRequestRoute } from "./PullRequests/DetailedPullRequestRoute";
import { PullRequestRoute } from "./PullRequests/PullRequestRoute";
import { DetailedRepositoryRoute } from "./Repositories/DetailedRepositoryRoute";
import { RepositoriesRoute } from "./Repositories/RepositoriesRoute";
import { LandingRoute } from "./Landing/LandingRoute";

export const HomeRoute = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();

  const canViewRoute =
    (appState.user === undefined &&
      AuthorizedRoutes.indexOf(pathname as Routes) < 0) ||
    appState.user !== undefined;

  if (!canViewRoute) return <Redirect to={Routes.Unauthorised} />;

  return (
    <Switch>
      <Route path={Routes.PullRequests} component={PullRequestRoute} />
      <Route path={Routes.Repositories} component={RepositoriesRoute} />
      <Route path={Routes.Activity} component={ActivityRoute} />
      <Route path={Routes.Landing} component={LandingRoute} />
      <Route path={Routes.Repository} component={DetailedRepositoryRoute} />
      <Route path={Routes.PullRequest} component={DetailedPullRequestRoute} />
    </Switch>
  );
};
