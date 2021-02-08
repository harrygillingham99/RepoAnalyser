import { apiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import { Redirect } from "react-router-dom";
import { useEffectOnce } from "react-use";

export const AuthenticationHandler = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const { setAppState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();

  const resolveAuthenticationToken = (code: string | null, state: string) => {
    (async () => {
      try {
        if (code === null) throw new Error("No code provided");
        var result = await apiClient.authentication_GetOAuthTokenWithUserInfo(
          code,
          state,
          buildUserInfo()
        );
        setAppState({ token: result.accessToken, user: result.user });
      } catch (error) {
        showErrorAlert("Authentication Error", "Unable to resolve user.");
      }
    })();
  };

  useEffectOnce(() => resolveAuthenticationToken(code, "state"));

  return <Redirect to={Routes.Home} />;
};
