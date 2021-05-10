import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { Loader } from "@components/BaseComponents/Loader";
import { GitHubCommit, PullFileInfo } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";
import useSetState from "react-use/lib/useSetState";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

interface IFilesAndCommitsProps {
  lastUpdated?: Date;
  repoName: string;
  repoId?: number;
  pullNumber: number;
  commits?: GitHubCommit[];
  modifiedPaths?: string[];
}

interface IFilesAndCommitsState {
  selectedFile?: string;
  fileInfo?: PullFileInfo;
}

export const FilesAndCommits = ({
  lastUpdated,
  repoName,
  commits,
  modifiedPaths,
  pullNumber,
  repoId,
}: IFilesAndCommitsProps) => {
  const [state, setState] = useSetState<IFilesAndCommitsState>();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [loading, setLoading] = useState(false);
  const { appState } = AppContainer.useContainer();
  useEffect(() => {
    (async () => {
      try {
        if (!repoId || !state.selectedFile) return;
        setLoading(true);
        const splitFile = state.selectedFile.split(".");
        const result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetPullFileInformation(
          repoId,
          pullNumber,
          splitFile[0],
          splitFile[1],
          buildUserInfo
        );
        setState({ fileInfo: result });
      } catch (error) {
        showErrorAlert("Error", "Error fetching file information");
      } finally {
        setLoading(false);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.selectedFile]);

  return (
    <Container className="mt-1" fluid>
      <Row>
        <Col sm={4}>
          <Card>
            <Card.Header>
              Pull Last Updated:{" "}
              {lastUpdated?.toLocaleString("en-GB") ?? "never"}
            </Card.Header>
            {state.selectedFile && state.fileInfo && !loading && (
              <Card.Body>
                <Card.Title>File Statistics</Card.Title>
                <Card.Subtitle className="mb-2">
                  {state.selectedFile}
                </Card.Subtitle>
                <Card.Text className="mb-1">
                  Additions: {state.fileInfo.additions}
                </Card.Text>
                <Card.Text className="mb-1">
                  Deletions: {state.fileInfo.deletions}
                </Card.Text>
                <Card.Text className="mb-1">
                  Commits for {state.selectedFile}:{" "}
                  {state.fileInfo.commitsThatIncludeFile}
                </Card.Text>
              </Card.Body>
            )}
            {loading && <Loader />}
          </Card>

          {commits && modifiedPaths && (
            <DirectoryTree
              dirs={modifiedPaths.map((path) => path.split("/"))}
              setSelectedItem={(file) => setState({ selectedFile: file })}
              repoName={repoName}
            />
          )}
        </Col>
        {commits && (
          <Col sm={8}>
            <Row></Row>
            <Col className="p-0">
              <h4 className="d-flex">Commits</h4>
            </Col>
            {commits.length > 0 ? (
              <VerticalTimeline className="pl-0 pr-0 m-0 w-100">
                {commits.map((commit) => {
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
  );
};
