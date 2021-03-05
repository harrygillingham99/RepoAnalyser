import { KanbanBoard } from "@components/KanbanBoard";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { AppContainer } from "@state/AppStateContainer";
import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

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
      <Route path={buildRoute(HomeSubRoutes.Commits)}>Commits</Route>
      <Route path={buildRoute(HomeSubRoutes.Contributions)}>
        Contributions
      </Route>
      <Route path={buildRoute(HomeSubRoutes.PullRequests)}>PRs</Route>
      <Route path={buildRoute(HomeSubRoutes.Repositories)}>Repos!</Route>
      <Route path={buildRoute(HomeSubRoutes.LandingPage)}>
        <Jumbotron fluid>
          <Container>
            <h1>Welcome {appState?.user?.name ?? "please log in!"}</h1>
          </Container>
        </Jumbotron>
      </Route>
      <Route>
        <Redirect to={Routes.NotFound} />
      </Route>
    </Switch>
  );
};
