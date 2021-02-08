import { User } from "@services/api/Client";
import { useSetState } from "react-use";
import { createContainer } from "unstated-next";

interface IAppState {
  token: string;
  loginRedirectUrl: string;
  user?: User;
}
const useAppState = () => {
  const [appState, setAppState] = useSetState<IAppState>({
    token: "",
    user: undefined,
    loginRedirectUrl: "",
  });
  return { appState, setAppState };
};

export const AppContainer = createContainer(useAppState);
