import { Loader } from "@components/BaseComponents/Loader";
import { RepoContributionResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffectOnce, useSetState } from "react-use";

interface SummaryProps {
  repoId: number;
}

interface SummaryState {
  contributions: RepoContributionResponse;
  loading: boolean;
}

export const ContribuitionVolume = (props: SummaryProps) => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<SummaryState>();
  useEffectOnce(() => {
    (async () => {
      try {
        setState({ loading: true });
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetRepoContributionVolumes(
          props.repoId,
          appState.connection.connectionId!,
          buildUserInfo
        );
        setState({ contributions: result });
      } catch (error) {
        showErrorAlert(
          "Error",
          "Error getting contribution volumes for repository."
        );
      } finally {
        setState({ loading: false });
      }
    })();
  });

  return !state.loading && state.contributions ? (
    <>{JSON.stringify(state?.contributions)}</>
  ) : !state.loading && state.contributions ? (
    <span>No Issues</span>
  ) : (
    <Loader />
  );
};
