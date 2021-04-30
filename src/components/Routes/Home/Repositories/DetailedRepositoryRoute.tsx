import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DetailedRepository, GitHubCommit } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";
import { CodeOwners } from "./DetailedRepositoryTabs/CodeOwners";
import { ContribuitionVolume } from "./DetailedRepositoryTabs/ContributionVolume";
import { CyclomaticComplexity } from "./DetailedRepositoryTabs/CyclomaticComplexity";
import { IssuesBugs } from "./DetailedRepositoryTabs/IssuesBugs";
import { RepositorySummary } from "./DetailedRepositoryTabs/RepositorySummary";

interface RouteParams {
  repoId: string;
  repoName: string;
}

interface DetailedRepositoryRouteState {
  repo: DetailedRepository;
  activeTab: string;
  selectedFile?: string;
  fileCommits?: GitHubCommit[];
}

export const DetailedRepositoryRoute = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { repoId, repoName } = useParams<RouteParams>();
  const repoNumber = Number.parseInt(repoId);
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<DetailedRepositoryRouteState>({
    repo: undefined!,
    activeTab: "Code Owners",
  });

  useEffectOnce(() => {
    (async () => {
      try {
        if (!appState.token) return;
        setLoading(true);
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetDetailedRepository(repoNumber, buildUserInfo);
        setState({ repo: result });
      } catch (error) {
        showErrorAlert(
          "Error",
          "Error getting detailed repository information"
        );
      } finally {
        setLoading(false);
      }
    })();
  });

  return appState.token === undefined ? (
    <Redirect to={Routes.Landing} />
  ) : (
    <>
      <DashboardHeader text={repoName} className="mb-2" />
      {state.repo && state.repo?.repository?.id && state.repo.isDotNetProject && (
        <Tabs
          activeKey={state.activeTab}
          onSelect={(key) => setState({ activeTab: key ?? undefined })}
        >
          <Tab eventKey="Code Owners" title="Code Owners">
            {state.repo?.codeOwners &&
              state.repo?.repository?.name &&
              !loading && (
                <CodeOwners
                  setLastUpdated={(when) =>
                    setState((prev) => {
                      const oldState = prev;
                      oldState.repo.codeOwnersLastUpdated = when;
                      return oldState;
                    })
                  }
                  repoId={state.repo.repository!.id!}
                  lastUpdated={state.repo.codeOwnersLastUpdated}
                  codeOwners={state.repo.codeOwners}
                  loading={loading}
                  setLoading={setLoading}
                  repoName={state.repo.repository.name}
                />
              )}
          </Tab>

          <Tab eventKey="Complexity Analysis" title="Complexity Analysis">
            <CyclomaticComplexity
              updateLastCalculated={(date) =>
                setState((prev) => {
                  const oldState = prev;
                  prev.repo.cyclomaticComplexitiesLastUpdated = date;
                  return oldState;
                })
              }
              repoId={state.repo.repository.id!}
              cyclomaticComplexities={state.repo.cyclomaticComplexities}
              lastCalculated={state.repo.cyclomaticComplexitiesLastUpdated}
            />
          </Tab>
          <Tab eventKey="Issues/Bugs" title="Issues/Bugs">
            <IssuesBugs repoId={state.repo.repository.id} />
          </Tab>
          <Tab eventKey="Contribution Volumes" title="Contribution Volumes">
            <ContribuitionVolume repoId={state.repo.repository.id} />
          </Tab>
          <Tab tabClassName="ml-auto" eventKey="Summary" title="Summary">
            <RepositorySummary repoId={state.repo.repository.id} />
          </Tab>
        </Tabs>
      )}
      {loading && <Loader />}
    </>
  );
};
