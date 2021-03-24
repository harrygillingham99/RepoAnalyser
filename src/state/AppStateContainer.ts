import { AuthCookieKey } from "@constants/CookieConstants";
import { User } from "@services/api/Client";
import { Routes } from "@typeDefinitions/Routes";
import { expireCookie } from "@utils/CookieProvider";
import { useSetState } from "react-use";
import { createContainer } from "unstated-next";
import * as SignalR from "@microsoft/signalr";
import { appHubUrl } from "@constants/Config";

interface IAppState {
  token: string;
  loginRedirectUrl: string;
  user: User;
  loading: boolean;
  connection: SignalR.HubConnection;
}

const connection = new SignalR.HubConnectionBuilder()
  .withUrl(appHubUrl)
  .configureLogging(SignalR.LogLevel.Information)
  .withAutomaticReconnect()
  .build();

const useAppState = () => {
  const startSignalR = () => {
    async function start() {
      try {
        await connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
      }
    }

    connection.onreconnecting(() => console.log("SignalR Reconnecting"));

    connection.onreconnected(() => console.log("SignalR Reconnected"));

    connection.state === SignalR.HubConnectionState.Disconnected && start();

    return connection;
  };

  const [appState, setAppState] = useSetState<IAppState>({
    token: undefined!,
    user: undefined!,
    loginRedirectUrl: undefined!,
    loading: true,
    connection: startSignalR(),
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
