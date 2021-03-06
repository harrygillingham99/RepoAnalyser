import { apiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import { setCookie } from "@utils/CookieProvider";
import { AuthCookieKey } from "@constants/CookieConstants";
import { Redirect } from "react-router-dom";
import { useEffectOnce } from "react-use";

export const AuthenticationHandler = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const { setUserAndToken, toggleLoading } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();

  const resolveAuthenticationToken = (code: string | null, state: string) => {
    try {
      toggleLoading(true);
      if (code === null) throw new Error("No code provided");
      (async () => {
        var result = await apiClient.authentication_GetOAuthTokenWithUserInfo(
          code,
          state,
          buildUserInfo()
        );
        if (result && result.user && result.accessToken) {
          setUserAndToken(result.user, result.accessToken);
          setCookie(AuthCookieKey, result.accessToken);
        } else {
          throw new Error("User was null");
        }
      })();
    } catch (error) {
      showErrorAlert("Authentication Error", "Unable to resolve user.");
    } finally {
      toggleLoading(false);
    }
  };

  useEffectOnce(() => resolveAuthenticationToken(code, "state"));

  return <Redirect to={Routes.Home} />;
};
