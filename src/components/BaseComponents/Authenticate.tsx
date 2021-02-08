import { apiClient } from "@services/api/Index";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import { Redirect } from "react-router-dom";

export const Authenticate = () => {
  const { setState } = AppContainer.useContainer();
  const resolveAuthenticationToken = (code: string, state: string) => {
    (async () => {
      var result = await apiClient.authentication_GetOAuthToken(
        code,
        state,
        buildUserInfo()
      );
      setState({ token: result });
    })();
  };
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (code === null) return <Redirect to={Routes.Home} />;
  resolveAuthenticationToken(code, "state");
  return <Redirect to={Routes.Home} />;
};
