import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { DetailedRepository, GitHubCommit } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect } from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { Github } from "react-bootstrap-icons";

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
  const [loadingFileInfo, setLoadingFileInfo] = React.useState<boolean>(false);
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

  useEffect(() => {
    (async () => {
      try {
        if (
          state.selectedFile &&
          state.repo?.repository?.id !== undefined &&
          state.selectedFile.indexOf(".") >= 0
        ) {
          console.log(state.selectedFile);
          setLoadingFileInfo(true);
          const splitFileName = state.selectedFile.split(".");
          const result = await authorisedApiClient(
            appState.token
          ).repository_GetFileInformation(
            state.repo.repository.id,
            splitFileName[0],
            splitFileName[1],
            buildUserInfo
          );
          setState({ fileCommits: result });
        }
      } catch (error) {
        showErrorAlert("Error", "Error getting commits for file");
      } finally {
        setLoadingFileInfo(false);
        console.log(state.fileCommits);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.selectedFile]);

  const recalculateCodeOwners = async () => {
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
              <Col sm={4}>
                <Button
                  className="mb-2"
                  variant="info"
                  onClick={() => recalculateCodeOwners()}
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
                  <Col sm={8}>
                    <Row></Row>
                    <Col>
                      <h6 className="d-flex">File: {selectedFile}</h6>
                    </Col>
                    <Col>
                      <h6 className="d-flex">
                        Owned By:{" "}
                        {state.repo?.codeOwners !== undefined && selectedFile
                          ? state.repo.codeOwners[selectedFile]
                          : "Unknown"}
                      </h6>
                    </Col>
                    {state.fileCommits &&
                      state.selectedFile &&
                      !loadingFileInfo && (
                        <VerticalTimeline>
                          {state.fileCommits.map((commit) => {
                            const colour = "#17a2b8";
                            return (
                              <VerticalTimelineElement
                                key={`timeLineItem-${commit.sha}`}
                                className="vertical-timeline-element--work"
                                contentStyle={{
                                  background: colour,
                                  color: "#fff",
                                }}
                                contentArrowStyle={{
                                  borderRight: `7px solid  ${colour}`,
                                }}
                                iconStyle={{
                                  background: colour,
                                  color: "#fff",
                                }}
                                icon={<Github />}
                              >
                                <h4 className="vertical-timeline-element-title">
                                  {commit.author?.login}
                                </h4>
                                <h5 className="vertical-timeline-element-subtitle">
                                  <a
                                    href={commit.htmlUrl}
                                    className="text-reset"
                                  >
                                    {commit.commit?.message}
                                  </a>
                                </h5>
                                <p></p>
                              </VerticalTimelineElement>
                            );
                          })}
                        </VerticalTimeline>
                      )}
                    {loadingFileInfo && <Loader />}
                  </Col>
                )}
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="Complexity Analysis" title="Complexity Analysis"></Tab>
      </Tabs>
      {loading && <Loader />}
    </>
  );
};
