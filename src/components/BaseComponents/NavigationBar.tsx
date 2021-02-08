import { AppContainer } from "@state/AppStateContainer";
import { Github } from "react-bootstrap-icons";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiClient } from "@services/api/Index";
import { useEffectOnce } from "react-use";
import { buildUserInfo } from "@utils/ClientInfo";

export const NavigationBar = () => {
  const { appState, setAppState } = AppContainer.useContainer();

  useEffectOnce(() => {
    (async () => {
      const result = await apiClient.authentication_GetLoginRedirectUrl(
        buildUserInfo()
      );
      setAppState({ loginRedirectUrl: result });
    })();
  });

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 9999 }}>
      <Link to={Routes.Home}>
        <Navbar.Brand>Repo Analyser</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" to={Routes.Home}>
            Home
          </Link>
        </Nav>
        <div>
          {appState.user === undefined && (
            <a href={appState.loginRedirectUrl}>
              <Button variant="info">
                <Github /> Login With GitHub
              </Button>
            </a>
          )}
          {appState.user && <Button variant="info">Account</Button>}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
