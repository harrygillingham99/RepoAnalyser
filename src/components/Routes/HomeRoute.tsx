import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";
import { splitPath } from "@utils/Urls";
import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

export const HomeRoute = () => {
  const { pathname } = useLocation();
  const pageName = splitPath(pathname, 1, false);

  return (
    <>
      <Jumbotron fluid>
        <Container>
          <h1>{pageName}</h1>
        </Container>
      </Jumbotron>
      <Switch>
        <Route path={`${Routes.Home}${HomeSubRoutes.Commits}`}>Commits</Route>
        <Route path={`${Routes.Home}${HomeSubRoutes.Contributions}`}>
          Contributions
        </Route>
        <Route path={`${Routes.Home}${HomeSubRoutes.PullRequests}`}>PRs</Route>
        <Route path={`${Routes.Home}${HomeSubRoutes.Repositories}`}>
          Repos!
        </Route>
        <Route path={`${Routes.Home}${HomeSubRoutes.LandingPage}`}>Home!</Route>
        <Route exact path={Routes.Home}>
          <Redirect to={`${Routes.Home}${HomeSubRoutes.LandingPage}`} />
        </Route>
        <Route>
          <Redirect to={Routes.NotFound} />
        </Route>
      </Switch>
    </>
  );
};
