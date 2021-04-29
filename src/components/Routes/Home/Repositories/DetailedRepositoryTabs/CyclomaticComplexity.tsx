import { CyclomaticComplexityRequest } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";

interface ICyclomaticComplexityProps {
  repoId: number;
  cyclomaticComplexities?: { [key: string]: number };
}

interface ICyclomaticComplexityState {
  cyclomaticComplexities?: { [key: string]: number };
}

export const CyclomaticComplexity = ({
  repoId,
  cyclomaticComplexities,
}: ICyclomaticComplexityProps) => {
  const [state, setState] = useSetState<ICyclomaticComplexityState>({
    cyclomaticComplexities: cyclomaticComplexities,
  });
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [loading, setLoading] = useState(false);
  const recalculateCyclomaticComplexities = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      var request = new CyclomaticComplexityRequest({
        pullRequestNumber: undefined,
        repoId: repoId,
        filesToSearch: undefined,
      });
      var result = await authorisedApiClient(
        appState.token
      ).repository_GetCyclomaticComplexities(
        appState.connection.connectionId ?? "",
        buildUserInfo,
        request
      );
      setState({ cyclomaticComplexities: result });
    } catch (error) {
      console.log(error);
      showErrorAlert("Error", error.detail);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="mt-1" fluid>
      <Button
        className="mb-2"
        variant="info"
        onClick={() => recalculateCyclomaticComplexities()}
      >
        Re-Calculate Cyclomatic Complexities
      </Button>
      {!loading &&
        state.cyclomaticComplexities &&
        JSON.stringify(state.cyclomaticComplexities)}
    </Container>
  );
};
