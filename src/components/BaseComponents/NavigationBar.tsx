import { AppContainer } from "@state/AppStateContainer";
import { Github } from "react-bootstrap-icons";
import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiClient } from "@services/api/Index";
import { useEffectOnce } from "react-use";
import { buildUserInfo } from "@utils/ClientInfo";
import { AlertContainer } from "@state/AlertContainer";

export const NavigationBar = () => {
  const { appState, setLoginRedirect } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();

  useEffectOnce(() => {
    (async () => {
      try {
        const urlResult = await apiClient.authentication_GetLoginRedirectUrl(
          buildUserInfo()
        );
        setLoginRedirect(urlResult);
      } catch (error) {
        showErrorAlert(
          "Authentication Error",
          "Error getting the GitHub callback URL."
        );
      }
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
          {appState.user && (
            <Link className="nav-link" to={Routes.Account}>
              Account
            </Link>
          )}
        </Nav>

        <div>
          {appState.user === undefined && (
            <a href={appState.loginRedirectUrl}>
              <Button variant="info">
                <Github /> Login With GitHub
              </Button>
            </a>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
