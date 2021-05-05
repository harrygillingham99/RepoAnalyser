import { DirectoryTree } from "@components/BaseComponents/DirectoryTree";
import { Loader } from "@components/BaseComponents/Loader";
import { RepoContributionResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { useEffectOnce, useSetState } from "react-use";

interface ContributionVolumeProps {
  repoId: number;
  repoName: string;
}

interface ContriubutionVolumeState {
  contributions: RepoContributionResponse;
  loading: boolean;
  selectedFile?: string;
}

export const ContribuitionVolume = (props: ContributionVolumeProps) => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<ContriubutionVolumeState>();
  useEffectOnce(() => {
    (async () => {
      try {
        setState({ loading: true });
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetRepoContributionVolumes(
          props.repoId,
          appState.connection.connectionId!,
          buildUserInfo
        );
        setState({ contributions: result });
      } catch (error) {
        showErrorAlert(
          "Error",
          "Error getting contribution volumes for repository."
        );
      } finally {
        setState({ loading: false });
      }
    })();
  });

  const selectedFile =
    state.contributions?.locForFiles &&
    state.selectedFile !== undefined &&
    Object.keys(state.contributions.locForFiles).find((key) =>
      key.includes(state.selectedFile!)
    );

  return !state.loading &&
    state.contributions &&
    state.contributions.locForFiles &&
    Object.keys(state.contributions.locForFiles).length > 0 ? (
    <Row className="ml-auto mr-auto">
      <Col sm={4}>
        <DirectoryTree
          dirs={Object.keys(state.contributions.locForFiles).map((x) =>
            x.split("/")
          )}
          setSelectedItem={(file) => setState({ selectedFile: file })}
          repoName={props.repoName}
          useFullPath={true}
          skipAddingRoot={true}
        />
      </Col>
      <Col sm={8}>
        {selectedFile && (
          <>
            <p>Added: {state.contributions.locForFiles[selectedFile].added}</p>
            <p>
              Removed: {state.contributions.locForFiles[selectedFile].removed}
            </p>
          </>
        )}
      </Col>
    </Row>
  ) : !state.loading && state.contributions ? (
    <span>You have not contributed to {props.repoName}</span>
  ) : (
    <Loader />
  );
};
