import { Loader } from "@components/BaseComponents/Loader";
import { RepoSummaryResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { useEffectOnce, useSetState } from "react-use";

interface ContribuitionVolumeProps {
  repoId: number;
}

interface ContribuitionVolumeState {
  summary: RepoSummaryResponse;
  loading: boolean;
}

export const RepositorySummary = (props: ContribuitionVolumeProps) => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<ContribuitionVolumeState>();
  useEffectOnce(() => {
    (async () => {
      try {
        setState({ loading: true });
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetRepoSummary(props.repoId, buildUserInfo);
        setState({ summary: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting issues for repository.");
      } finally {
        setState({ loading: false });
      }
    })();
  });
  return !state.loading && state.summary ? (
    <>{JSON.stringify(state?.summary)}</>
  ) : !state.loading && state.summary ? (
    <span>No Issues</span>
  ) : (
    <Loader />
  );
};
