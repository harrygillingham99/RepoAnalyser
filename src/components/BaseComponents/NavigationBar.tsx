import { AppContainer } from "@state/AppStateContainer";
import { Github } from "react-bootstrap-icons";
import { Routes } from "@typeDefinitions/Routes";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { apiClient, authorisedApiClient } from "@services/api/Index";
import { buildUserInfo } from "@utils/ClientInfo";
import { AlertContainer } from "@state/AlertContainer";
import { AuthCookieKey } from "@constants/CookieConstants";
import { getCookie } from "@utils/CookieProvider";
import { TestId } from "@tests/TestConstants";
import useEffectOnce from "react-use/lib/useEffectOnce";
import clsx from "clsx";

export const NavigationBar = () => {
  const { pathname } = useLocation();
  const {
    appState,
    setLoginRedirect,
    setUserTokenAndUrl,
    toggleLoading,
  } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();

  const showSettingsLink = appState.user !== undefined && !appState.loading;

  const canLogin = !appState.loading && appState.loginRedirectUrl;

  useEffectOnce(() => {
    toggleLoading(true);
    const savedAuthCookie = getCookie<string>(AuthCookieKey);
    //if the cookie is there we can use it to just fetch the user info straight away
    if (savedAuthCookie) {
      (async () => {
        try {
          const { user, loginRedirectUrl } = await authorisedApiClient(
            savedAuthCookie
          ).authentication_GetUserInformationForToken(buildUserInfo);
          if (user === undefined || loginRedirectUrl === undefined)
            throw new Error();
          setUserTokenAndUrl(user, savedAuthCookie, loginRedirectUrl);
        } catch (error) {
          console.log(error);
          showErrorAlert(
            "Authentication Error",
            error.message.includes("Failed to fetch")
              ? "Unable to reach API."
              : "Error logging in with existing cookie."
          );
        } finally {
          toggleLoading(false);
        }
      })();
      //if not we need to send the user through the OAuth flow again to authenticate
    } else {
      (async () => {
        try {
          const urlResult = await apiClient.authentication_GetLoginRedirectUrl(
            buildUserInfo
          );
          setLoginRedirect(urlResult);
        } catch (error) {
          showErrorAlert(
            "Authentication Error",
            error.message.includes("Failed to fetch")
              ? "Unable to reach API."
              : "Error getting the GitHub callback URL."
          );
        } finally {
          toggleLoading(false);
        }
      })();
    }
  });

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="nav-top"
      data-testid={TestId.Nav}
    >
      <Link to={Routes.Landing}>
        <Navbar.Brand>Repo Analyser</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {showSettingsLink && (
            <Link
              className={clsx(
                "nav-link",
                pathname.includes(Routes.Settings) && "active"
              )}
              to={Routes.Settings}
            >
              Settings
            </Link>
          )}
        </Nav>
        <div>
          {!appState.user && (
            <a
              className={clsx(!canLogin && "disabled")}
              href={appState.loginRedirectUrl}
            >
              <Button variant="info" disabled={!canLogin}>
                <Github /> Login With GitHub
              </Button>
            </a>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
