import { Loader } from "@components/BaseComponents/Loader";
import { PullSummaryResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { Container } from "react-bootstrap";
import { useEffectOnce, useSetState } from "react-use";

interface PullSummaryProps {
  repoId?: number;
  pullNumber?: number;
}

interface PullSummaryState {
  summary: PullSummaryResponse;
  loading: boolean;
}

export const PullSummary = ({ repoId, pullNumber }: PullSummaryProps) => {
  const [state, setState] = useSetState<PullSummaryState>({
    summary: undefined!,
    loading: false,
  });
  const { showErrorAlert } = AlertContainer.useContainer();
  const { appState } = AppContainer.useContainer();

  useEffectOnce(() => {
    if (!repoId || !pullNumber) return;
    (async () => {
      try {
        setState({ loading: true });
        var result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetPullRequestSummary(repoId, pullNumber, buildUserInfo);
        setState({ summary: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting summary for pull request.");
      } finally {
        setState({ loading: false });
      }
    })();
  });

  return !state.loading && state.summary ? (
    <Container className="text-center mt-2">
      <h4>You have contributed {state.summary.locAdded} lines of code.</h4>
      <h4>You have removed {state.summary.locRemoved} lines of code.</h4>
      {state.summary.isReviewer && (
        <h4>You are a reviewer on this pull request.</h4>
      )}
    </Container>
  ) : (
    <Loader />
  );
};
