import { AuthCookieKey } from "@constants/CookieConstants";
import { User } from "@services/api/Client";
import { Routes } from "@typeDefinitions/Routes";
import { expireCookie } from "@utils/CookieProvider";
import { useSetState } from "react-use";
import { createContainer } from "unstated-next";

interface IAppState {
  token: string;
  loginRedirectUrl: string;
  user: User;
}
const useAppState = () => {
  const [appState, setAppState] = useSetState<IAppState>({
    token: undefined!,
    user: undefined!,
    loginRedirectUrl: undefined!,
  });

  const signOut = (redirectToRoute: (route: Routes) => void) => {
    setAppState({ user: undefined });
    expireCookie(AuthCookieKey);
    redirectToRoute(Routes.Home);
  };

  const setUser = (user: User) => setAppState({ user: user });

  const setUserAndToken = (user: User, token: string) =>
    setAppState({ user: user, token: token });

  const setLoginRedirect = (url: string) =>
    setAppState({ loginRedirectUrl: url });

  return {
    appState,
    setUser,
    setUserAndToken,
    setLoginRedirect,
    signOut,
  };
};

export const AppContainer = createContainer(useAppState);
