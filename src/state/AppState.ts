import { useSetState } from "react-use";
import { createContainer } from "unstated-next";

interface IAppState {
  token: string;
  loginRedirectUrl: string;
}
const useAppState = () => {
  const [state, setState] = useSetState<IAppState>();
  return { state, setState };
};

export const AppContainer = createContainer(useAppState);
