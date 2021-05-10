import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DetailedPullRequest } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";
import { Discussion } from "./DetailedPullRequestTabs/Discussion";
import { FilesAndCommits } from "./DetailedPullRequestTabs/FilesAndCommits";

interface RouteParams {
  pullRequest: string;
  repoId: string;
  repoName: string;
}

interface DetailedPullRequestRouteState {
  pullRequest: DetailedPullRequest;
  activeTab: PullTabs;
}

enum PullTabs {
  FilesCommits = "Files & Commits",
  Discussion = "Discussion",
  Summary = "Summary",
}

export const DetailedPullRequestRoute = () => {
  const [state, setState] = useSetState<DetailedPullRequestRouteState>({
    activeTab: PullTabs.FilesCommits,
    pullRequest: undefined!,
  });
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
      <DashboardHeader text={`${repoName} #${pull} `} className="mb-2" />
      {loading && <Loader />}
      {!loading && (
        <Tabs
          activeKey={state.activeTab}
          onSelect={(key) =>
            setState({ activeTab: (key as PullTabs) ?? undefined })
          }
        >
          <Tab eventKey={PullTabs.FilesCommits} title={PullTabs.FilesCommits}>
            {state.activeTab === PullTabs.FilesCommits && (
              <FilesAndCommits
                commits={state.pullRequest?.commits}
                repoId={state.pullRequest?.pullRequest?.repositoryId}
                pullNumber={pull}
                repoName={repoName}
                lastUpdated={state.pullRequest?.pullRequest?.updatedAt}
                modifiedPaths={state.pullRequest?.modifiedFilePaths}
              />
            )}
          </Tab>
          <Tab eventKey={PullTabs.Discussion} title={PullTabs.Discussion}>
            {state.activeTab === PullTabs.Discussion && (
              <Discussion
                repoId={state.pullRequest.pullRequest?.repositoryId}
                pullNumber={state.pullRequest.pullRequest?.pullRequestNumber}
              />
            )}
          </Tab>
          <Tab
            tabClassName="ml-auto"
            eventKey={PullTabs.Summary}
            title={PullTabs.Summary}
          >
            {state.activeTab === PullTabs.Summary && <></>}
          </Tab>
        </Tabs>
      )}
    </>
  );
};
