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
import { CyclomaticComplexity } from "./DetailedRepositoryTabs/CyclomaticComplexity";

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
      <DashboardHeader text={repoName} />
      <Tabs
        activeKey={state.activeTab}
        onSelect={(key) => setState({ activeTab: key ?? undefined })}
      >
        <Tab eventKey="Code Owners" title="Code Owners">
          {state.repo?.codeOwners &&
            state.repo?.repository?.name &&
            !loading && (
              <CodeOwners
                repoId={state.repo.repository!.id!}
                lastUpdated={state.repo.codeOwnersLastUpdated}
                codeOwners={state.repo.codeOwners}
                loading={loading}
                setLoading={setLoading}
                repoName={state.repo.repository.name}
              />
            )}
        </Tab>
        {state.repo &&
          state.repo?.repository?.id &&
          state.repo.isDotNetProject && (
            <Tab eventKey="Complexity Analysis" title="Complexity Analysis">
              <CyclomaticComplexity
                repoId={state.repo.repository.id!}
                cyclomaticComplexities={state.repo.cyclomaticComplexities}
              />
            </Tab>
          )}
      </Tabs>
      {loading && <Loader />}
    </>
  );
};
