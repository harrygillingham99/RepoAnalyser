import { AuthCookieKey } from "@constants/CookieConstants";
import { User } from "@services/api/Client";
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

  const signOut = () => {
    setAppState({ user: undefined });
    expireCookie(AuthCookieKey);
  };
  return { appState, setAppState, signOut };
};

export const AppContainer = createContainer(useAppState);
