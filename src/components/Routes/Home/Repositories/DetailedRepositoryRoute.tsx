import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { DetailedRepository } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";

interface RouteParams {
  repoId: string;
  repoName: string;
}

interface DetailedRepositoryRouteState {
  repo: DetailedRepository;
  activeTab: string;
  selectedFile?: string;
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

  const reCalculateCodeOwners = async () => {
    if (!state.repo || !state.repo.repository || !state.repo.repository.id)
      return;
    setLoading(true);
    var result = await authorisedApiClient(
      appState.token
    ).repository_GetCodeOwnersForRepo(
      state.repo.repository.id,
      appState.connection.connectionId ?? "",
      buildUserInfo
    );

    setState((previous) => {
      var newRepo = previous.repo;
      previous.repo.codeOwners = result;
      return { repo: newRepo };
    });
    setLoading(false);
  };

  const selectedFile =
    state.repo?.codeOwners &&
    state.selectedFile !== undefined &&
    Object.keys(state.repo.codeOwners).find((key) =>
      key.includes(state.selectedFile!)
    );

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
          <Container className="mt-1" fluid>
            <Row>
              <Col>
                <Button
                  className="mb-2"
                  variant="info"
                  onClick={() => reCalculateCodeOwners()}
                >
                  Re-Calculate Code Owners
                </Button>
                <div>
                  Last Calculated:{" "}
                  {state?.repo?.codeOwnersLastUpdated?.toLocaleString("en-GB", {
                    timeZone: "UTC",
                  }) ?? "never"}
                </div>
                {state.repo?.codeOwners &&
                  Object.keys(state.repo.codeOwners).length > 1 &&
                  !loading && (
                    <DirectoryTree
                      dirs={Object.keys(state.repo.codeOwners).map((dir) =>
                        dir.split("/")
                      )}
                      setSelectedItem={(file) =>
                        setState({ selectedFile: file })
                      }
                      repoName={repoName}
                    />
                  )}
              </Col>
              {state.repo?.codeOwners &&
                Object.keys(state.repo.codeOwners).length > 1 &&
                !loading && (
                  <Col>
                    <p>File: {selectedFile}</p>
                    <p>
                      Owned By:{" "}
                      {state.repo?.codeOwners !== undefined && selectedFile
                        ? state.repo.codeOwners[selectedFile]
                        : "Unknown"}
                    </p>
                  </Col>
                )}
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="Commits" title="Commits">
          {state.repo && !loading && <>{JSON.stringify(state.repo)}</>}
        </Tab>
        <Tab eventKey="Complexity Analysis" title="Complexity Analysis"></Tab>
      </Tabs>
      {loading && <Loader />}
    </>
  );
};
