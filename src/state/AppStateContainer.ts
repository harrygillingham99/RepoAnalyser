import { AuthCookieKey } from "@constants/CookieConstants";
import { User } from "@services/api/Client";
import { Routes } from "@typeDefinitions/Routes";
import { expireCookie } from "@utils/CookieProvider";
import { useSetState } from "react-use";
import { createContainer } from "unstated-next";
import * as SignalR from "@microsoft/signalr";
import { buildStartSignalR } from "@utils/SignalR";

interface IAppState {
  token: string;
  loginRedirectUrl: string;
  user: User;
  loading: boolean;
  connection: SignalR.HubConnection;
}
const useAppState = () => {
  const [appState, setAppState] = useSetState<IAppState>({
    token: undefined!,
    user: undefined!,
    loginRedirectUrl: undefined!,
    loading: true,
    connection: buildStartSignalR(),
  });

  const signOut = (redirectToRoute: (route: Routes) => void) => {
    setAppState({ user: undefined, token: undefined });
    expireCookie(AuthCookieKey);
    redirectToRoute(Routes.Landing);
  };

  const setUser = (user: User) => setAppState({ user: user });

  const setUserTokenAndUrl = (user: User, token: string, url: string) =>
    setAppState({ user: user, token: token, loginRedirectUrl: url });

  const setLoginRedirect = (url: string) =>
    setAppState({ loginRedirectUrl: url });

  const setUserAndToken = (user: User, token: string) =>
    setAppState({ user: user, token: token });

  const toggleLoading = (toggle: boolean) => setAppState({ loading: toggle });

  return {
    appState,
    setUser,
    setUserTokenAndUrl,
    setUserAndToken,
    setLoginRedirect,
    toggleLoading,
    signOut,
  };
};

export const AppContainer = createContainer(useAppState);
