import { Loader } from "@components/BaseComponents/Loader";
import { RepoIssuesResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffectOnce, useSetState } from "react-use";

interface IssuesBugsProps {
  repoId: number;
}

interface IssuesBugsState {
  issues: RepoIssuesResponse;
  loading: boolean;
}

export const IssuesBugs = (props: IssuesBugsProps) => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<IssuesBugsState>();
  useEffectOnce(() => {
    (async () => {
      try {
        setState({ loading: true });
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetRepoIssues(props.repoId, buildUserInfo);
        setState({ issues: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting issues for repository.");
      } finally {
        setState({ loading: false });
      }
    })();
  });
  return !state.loading &&
    state.issues &&
    (state.issues?.issues?.length ?? 0) > 0 ? (
    <>{JSON.stringify(state?.issues)}</>
  ) : !state.loading && state.issues?.issues?.length === 0 ? (
    <span>No Issues</span>
  ) : (
    <Loader />
  );
};
