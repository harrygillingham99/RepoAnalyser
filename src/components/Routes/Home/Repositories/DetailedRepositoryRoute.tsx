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
import { StaticAnalysis } from "./DetailedRepositoryTabs/StaticAnalysis";

interface RouteParams {
  repoId: string;
  repoName: string;
}

interface DetailedRepositoryRouteState {
  repo: DetailedRepository;
  activeTab: RepoTabs;
  selectedFile?: string;
  fileCommits?: GitHubCommit[];
}

enum RepoTabs {
  CodeOwners = "Code Owners",
  Complexity = "Complexity Analysis",
  StaticAnalysis = "Static Analysis",
  Issues = "Issues/Bugs",
  ContributionVolume = "Contribution Volume",
  Summary = "Summary",
}

export const DetailedRepositoryRoute = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { repoId, repoName } = useParams<RouteParams>();
  const repoNumber = Number.parseInt(repoId);
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<DetailedRepositoryRouteState>({
    repo: undefined!,
    activeTab: RepoTabs.CodeOwners,
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
      {state.repo && state.repo?.repository?.id && (
        <Tabs
          activeKey={state.activeTab}
          onSelect={(key) =>
            key !== null && setState({ activeTab: key as RepoTabs })
          }
        >
          <Tab eventKey={RepoTabs.CodeOwners} title={RepoTabs.CodeOwners}>
            {state.repo?.codeOwners &&
              state.repo?.repository?.name &&
              state.activeTab === RepoTabs.CodeOwners &&
              !loading && (
                <CodeOwners
                  lastUpdatedHook={[
                    state.repo.codeOwnersLastUpdated,
                    (when) =>
                      setState((prev) => {
                        const oldState = prev;
                        oldState.repo.codeOwnersLastUpdated = when;
                        return oldState;
                      }),
                  ]}
                  repoId={state.repo.repository!.id!}
                  codeOwners={state.repo.codeOwners}
                  loadingHook={[loading, setLoading]}
                  repoName={state.repo.repository.name}
                />
              )}
          </Tab>
          {state.repo.isDotNetProject && (
            <Tab eventKey={RepoTabs.Complexity} title={RepoTabs.Complexity}>
              {state.activeTab === RepoTabs.Complexity && (
                <CyclomaticComplexity
                  lastCalculatedHook={[
                    state.repo.cyclomaticComplexitiesLastUpdated,
                    (date) =>
                      setState((prev) => {
                        const oldState = prev;
                        prev.repo.cyclomaticComplexitiesLastUpdated = date;
                        return oldState;
                      }),
                  ]}
                  repoId={state.repo.repository.id!}
                  cyclomaticComplexities={state.repo.cyclomaticComplexities}
                />
              )}
            </Tab>
          )}
          {state.repo.isDotNetProject && state.repo.staticAnalysisHtml && (
            <Tab
              eventKey={RepoTabs.StaticAnalysis}
              title={RepoTabs.StaticAnalysis}
            >
              {state.activeTab === RepoTabs.StaticAnalysis && (
                <StaticAnalysis
                  lastCalculatedHook={[
                    state.repo.staticAnalysisLastUpdated,
                    (date) =>
                      setState((prev) => {
                        const oldState = prev;
                        prev.repo.staticAnalysisLastUpdated = date;
                        return oldState;
                      }),
                  ]}
                  repoId={state.repo.repository.id!}
                  staticAnalysisHtml={state.repo.staticAnalysisHtml}
                />
              )}
            </Tab>
          )}
          <Tab eventKey={RepoTabs.Issues} title={RepoTabs.Issues}>
            {state.activeTab === RepoTabs.Issues && (
              <IssuesBugs repoId={state.repo.repository.id} />
            )}
          </Tab>
          <Tab
            eventKey={RepoTabs.ContributionVolume}
            title={RepoTabs.ContributionVolume}
          >
            {state.activeTab === RepoTabs.ContributionVolume && (
              <ContribuitionVolume
                repoId={state.repo.repository.id}
                repoName={repoName}
              />
            )}
          </Tab>
          <Tab
            tabClassName="ml-auto"
            eventKey={RepoTabs.Summary}
            title={RepoTabs.Summary}
          >
            {state.activeTab === RepoTabs.Summary && (
              <RepositorySummary repoId={state.repo.repository.id} />
            )}
          </Tab>
        </Tabs>
      )}
      {loading && <Loader />}
    </>
  );
};
