import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { Loader } from "@components/BaseComponents/Loader";
import { GitHubCommit } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";
import { useSetState } from "react-use";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

interface ICodeOwnerProps {
  repoId: number;
  lastUpdated?: Date;
  codeOwners: { [key: string]: string };
  setLoading: (loading: boolean) => void;
  loading: boolean;
  repoName: string;
}

interface ICodeOwnerState {
  fileCommits?: GitHubCommit[];
  codeOwners: { [key: string]: string };
  selectedFile?: string;
}

export const CodeOwners = ({
  repoId,
  lastUpdated,
  codeOwners,
  setLoading,
  loading,
  repoName,
}: ICodeOwnerProps) => {
  const [state, setState] = useSetState<ICodeOwnerState>({
    codeOwners: codeOwners,
  });
  const [loadingFileInfo, setLoadingFileInfo] = useState(false);
  const { showErrorAlert } = AlertContainer.useContainer();
  const { appState } = AppContainer.useContainer();

  useEffect(() => {
    (async () => {
      try {
        if (
          state.selectedFile &&
          repoId !== undefined &&
          state.selectedFile.indexOf(".") >= 0 &&
          state.selectedFile.charAt(0) !== "."
        ) {
          setLoadingFileInfo(true);
          const splitFileName = state.selectedFile.split(".");
          const result = await authorisedApiClient(
            appState.token
          ).repository_GetFileInformation(
            repoId,
            splitFileName[0],
            splitFileName[1],
            buildUserInfo
          );
          setState({ fileCommits: result });
        } else {
          setState({ fileCommits: undefined });
        }
      } catch (error) {
        showErrorAlert("Error", "Error getting commits for file");
      } finally {
        setLoadingFileInfo(false);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.selectedFile]);

  const recalculateCodeOwners = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      var result = await authorisedApiClient(
        appState.token
      ).repository_GetCodeOwnersForRepo(
        repoId,
        appState.connection.connectionId ?? "",
        buildUserInfo
      );

      setState({ codeOwners: result });
    } catch (error) {
      showErrorAlert("Error", error.detail);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageFileOwnership = (
    codeOwners: { [key: string]: string },
    login: string
  ) => {
    const total = Object.values(codeOwners).filter(
      (owner) => owner !== null && owner !== undefined
    ).length;
    return (
      (Object.values(codeOwners).filter((x) => x === login).length / total) *
      100
    ).toFixed(0);
  };

  const selectedFile =
    state.codeOwners &&
    state.selectedFile !== undefined &&
    Object.keys(state.codeOwners).find((key) =>
      key.includes(state.selectedFile!)
    );

  const splitFileDirectories = (codeOwners: { [key: string]: string }) =>
    Object.keys(codeOwners).map((dir) => dir.split("/"));
  return (
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
          <h6>
            Last Calculated:{" "}
            {lastUpdated?.toLocaleString("en-GB", {
              timeZone: "UTC",
            }) ?? "never"}
          </h6>
          {state.codeOwners &&
            Object.keys(state.codeOwners).length > 1 &&
            !loading && (
              <>
                <h6>
                  You own{" "}
                  {getPercentageFileOwnership(
                    state.codeOwners,
                    appState.user.login ?? ""
                  )}
                  % of this code base.
                </h6>
                <DirectoryTree
                  dirs={splitFileDirectories(state.codeOwners)}
                  setSelectedItem={(file) => setState({ selectedFile: file })}
                  repoName={repoName}
                />
              </>
            )}
        </Col>
        {state?.codeOwners &&
          Object.keys(state.codeOwners).length > 1 &&
          !loading && (
            <Col sm={8}>
              <Row></Row>
              <Col className="p-0">
                <h6 className="d-flex">File: {state.selectedFile}</h6>
              </Col>
              <Col className="p-0">
                <h6 className="d-flex">
                  Owned By:{" "}
                  {state?.codeOwners !== undefined && selectedFile
                    ? state.codeOwners[selectedFile]
                    : "Unknown"}
                </h6>
              </Col>
              {state.fileCommits !== undefined &&
              state.selectedFile &&
              !loadingFileInfo ? (
                <VerticalTimeline className="pl-0 pr-0 m-0 w-100">
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
                <p>No Commits</p>
              )}
              {loadingFileInfo && <Loader />}
            </Col>
          )}
      </Row>
    </Container>
  );
};
