import { AppContainer } from "@state/AppStateContainer";
import React from "react";
import { Jumbotron, Container } from "react-bootstrap";

export const HomeRoute = () => {
  const { appState } = AppContainer.useContainer();
  return (
    <Jumbotron fluid>
      <Container>
        <h1>
          Welcome, {appState?.user?.name ?? "please log in to continue.."}
        </h1>
      </Container>
    </Jumbotron>
  );
};
