import { AppContainer } from "@state/AppStateContainer";
import { Github } from "react-bootstrap-icons";
import { Routes } from "@typeDefinitions/Routes";
import React, { useState } from "react";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { apiClient, authorisedApiClient } from "@services/api/Index";
import { useEffectOnce } from "react-use";
import { buildUserInfo } from "@utils/ClientInfo";
import { AlertContainer } from "@state/AlertContainer";
import { AuthCookieKey } from "@constants/CookieConstants";
import { getCookie } from "@utils/CookieProvider";
import { TestId } from "@tests/TestConstants";
import { splitPath } from "@utils/Urls";
import { SearchContainer } from "@state/SearchContainer";

export const NavigationBar = () => {
  const { pathname } = useLocation();
  const {
    appState,
    setLoginRedirect,
    setUserAndToken,
  } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [loading, setLoading] = useState(false);
  const { setSearchText } = SearchContainer.useContainer();

  const shouldShowAccountLink = appState.user && !loading;

  const canLogin = !loading && appState.loginRedirectUrl;

  useEffectOnce(() => {
    setLoading(true);
    const savedAuthCookie = getCookie(AuthCookieKey);
    //if the cookie is there we can use it to just fetch the user info straight away
    if (savedAuthCookie) {
      (async () => {
        try {
          const user = await authorisedApiClient(
            savedAuthCookie
          ).authentication_GetUserInformationForToken(buildUserInfo());
          setUserAndToken(user, savedAuthCookie);
        } catch (error) {
          showErrorAlert(
            "Authentication Error",
            "Error logging in with existing cookie."
          );
        } finally {
          setLoading(false);
        }
      })();
      //if not we need to send the user through the OAuth flow again to authenticate
    } else {
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
        } finally {
          setLoading(false);
        }
      })();
    }
  });

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      style={{ zIndex: 9999 }}
      data-testid={TestId.Nav}
    >
      <Link to={Routes.Home}>
        <Navbar.Brand>Repo Analyser</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link
            className={`nav-link ${
              splitPath(pathname) === Routes.Home ? "active" : ""
            }`}
            to={Routes.Home}
          >
            Home
          </Link>
          {shouldShowAccountLink && (
            <Link
              className={`nav-link ${
                splitPath(pathname) === Routes.Account ? "active" : ""
              }`}
              to={Routes.Account}
            >
              Account
            </Link>
          )}
        </Nav>

        <div>
          {!appState.user ? (
            <a
              className={!canLogin ? "disabled" : ""}
              href={appState.loginRedirectUrl}
            >
              <Button variant="info" disabled={!canLogin}>
                <Github /> Login With GitHub
              </Button>
            </a>
          ) : (
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button variant="outline-info">Search</Button>
            </Form>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
