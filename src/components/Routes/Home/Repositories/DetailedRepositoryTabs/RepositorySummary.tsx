import { Loader } from "@components/BaseComponents/Loader";
import { RepoSummaryResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Container } from "react-bootstrap";
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
        ).repository_GetRepoSummary(
          props.repoId,
          appState.connection.connectionId!,
          buildUserInfo
        );
        setState({ summary: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting issues for repository.");
      } finally {
        setState({ loading: false });
      }
    })();
  });
  return !state.loading && state.summary ? (
    <Container className="text-center mt-2">
      <h4>
        You own: {state.summary.ownershipPercentage?.toFixed(2)}% of the files
        in this repo.
      </h4>
      <h4>
        You have contributed {state.summary.locContributed} lines of code.
      </h4>
      <h4>You have removed {state.summary.locRemoved} lines of code.</h4>
      {state.summary.averageCyclomaticComplexity !== -1 && (
        <h4>
          The average cyclomatic complexity for the methods in this project is:{" "}
          {state.summary.averageCyclomaticComplexity?.toFixed(2)}
        </h4>
      )}
      <h4>Total issues: {state.summary.totalIssues}</h4>
      <h6>Solved by you: {state.summary.issuesSolved}</h6>
      <h6>Raised by you: {state.summary.issuesRaised}</h6>
      {state.summary.analysisIssues !== -1 && (
        <h4>Number of issues in static analysis: {}</h4>
      )}
    </Container>
  ) : (
    <Loader />
  );
};
