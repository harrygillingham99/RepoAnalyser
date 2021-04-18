import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { Loader } from "@components/BaseComponents/Loader";
import { DetailedPullRequest } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useState } from "react";
import { Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

interface RouteParams {
  pullRequest: string;
  repoId: string;
  repoName: string;
}

interface DetailedPullRequestRouteState {
  pullRequest: DetailedPullRequest;
  activeTab: string;
  selectedFile?: string;
}

export const DetailedPullRequestRoute = () => {
  const [state, setState] = useSetState<DetailedPullRequestRouteState>({
    activeTab: "Files & Commits",
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
      <DashboardHeader text={`${repoName} #${pull} `} />
      {loading && <Loader />}
      {!loading && (
        <Tabs
          activeKey={state.activeTab}
          onSelect={(key) => setState({ activeTab: key ?? undefined })}
        >
          <Tab eventKey="Files & Commits" title="Files & Commits">
            <Container className="mt-1" fluid>
              <Row>
                <Col sm={4}>
                  {state.selectedFile && (
                    <Card>
                      <Card.Header>
                        {" "}
                        Pull Last Updated:{" "}
                        {state.pullRequest?.pullRequest?.updatedAt?.toLocaleString(
                          "en-GB",
                          {
                            timeZone: "UTC",
                          }
                        ) ?? "never"}
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>File Statistics</Card.Title>
                        <Card.Subtitle className="mb-2">
                          {state.selectedFile}
                        </Card.Subtitle>
                        <Card.Text>Additions: {}</Card.Text>
                        <Card.Text>Deletions: {}</Card.Text>
                      </Card.Body>
                    </Card>
                  )}
                  {state.pullRequest?.commits &&
                    state.pullRequest?.modifiedFilePaths &&
                    !loading && (
                      <DirectoryTree
                        dirs={state.pullRequest.modifiedFilePaths.map((path) =>
                          path.split("/")
                        )}
                        setSelectedItem={(file) =>
                          setState({ selectedFile: file })
                        }
                        repoName={repoName}
                      />
                    )}
                </Col>
                {state.pullRequest?.commits && (
                  <Col sm={8}>
                    <Row></Row>
                    <Col className="p-0">
                      <h4 className="d-flex">Commits</h4>
                    </Col>
                    {state.pullRequest?.commits !== undefined &&
                    state.pullRequest.commits.length > 0 ? (
                      <VerticalTimeline className="pl-0 pr-0 m-0 w-100">
                        {state.pullRequest.commits.map((commit) => {
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
                                {commit.author?.login ??
                                  commit.committer?.login ??
                                  "Unknown Contributor"}
                              </h4>
                              <h5 className="vertical-timeline-element-subtitle">
                                <a href={commit.htmlUrl} className="text-reset">
                                  {commit.commit?.message}
                                </a>
                              </h5>
                              <p>Added: {commit.stats?.additions}</p>
                              <p>Removed: {commit.stats?.deletions}</p>
                              <p>Total: {commit.stats?.total}</p>
                            </VerticalTimelineElement>
                          );
                        })}
                      </VerticalTimeline>
                    ) : (
                      <div>No Commits</div>
                    )}
                  </Col>
                )}
              </Row>
            </Container>
          </Tab>
        </Tabs>
      )}
    </>
  );
};
