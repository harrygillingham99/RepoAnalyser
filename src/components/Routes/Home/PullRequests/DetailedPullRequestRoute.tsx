import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DetailedPullRequest } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";

interface RouteParams {
  pullRequest: string;
  repoId: string;
  repoName: string;
}

interface DetailedPullRequestRouteState {
  pullRequest: DetailedPullRequest;
}

export const DetailedPullRequestRoute = () => {
  const [state, setState] = useSetState<DetailedPullRequestRouteState>();
  const [loading, setLoading] = useState(false);
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const { repoId, pullRequest, repoName } = useParams<RouteParams>();
  const repoNumber = Number.parseInt(repoId);
  const pull = Number.parseInt(pullRequest);

  useEffectOnce(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetDetailedPullRequest(repoNumber, pull, buildUserInfo);
        setState({ pullRequest: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting detailed pull request");
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <>
      <DashboardHeader text={`${repoName} #${pull} `} />
      {loading && <Loader />}
      {!loading && `repo - ${repoName} pull - ${pull}` + JSON.stringify(state)}
    </>
  );
};
