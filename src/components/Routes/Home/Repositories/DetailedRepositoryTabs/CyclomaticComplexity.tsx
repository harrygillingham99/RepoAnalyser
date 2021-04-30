import { Loader } from "@components/BaseComponents/Loader";
import { CyclomaticComplexityRequest } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useState } from "react";
import { Container, Button, Table } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";

interface ICyclomaticComplexityProps {
  repoId: number;
  cyclomaticComplexities?: { [key: string]: number };
  lastCalculated?: Date;
  updateLastCalculated: (when: Date) => void;
}

interface ICyclomaticComplexityState {
  cyclomaticComplexities?: { [key: string]: number };
}

export const CyclomaticComplexity = ({
  repoId,
  cyclomaticComplexities,
  lastCalculated,
  updateLastCalculated,
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
      updateLastCalculated(new Date(Date.now()));
    } catch (error) {
      showErrorAlert("Error", error.detail);
    } finally {
      setLoading(false);
    }
  };
  const getTypeForMethodName = (
    methodName: string
  ): "Property Accessor" | "Constructor" | "Method" => {
    if (methodName.includes("get_") || methodName.includes("set_")) {
      return "Property Accessor";
    }
    if (methodName.includes("ctor")) {
      return "Constructor";
    }
    return "Method";
  };
  const getFriendlyMethodName = (methodName: string) => {
    methodName = methodName.replaceAll("System.", "");
    if (methodName.length > 100)
      methodName = methodName.substring(0, 100) + "...";
    return methodName;
  };

  const getAverageComplexity = (complexities: {
    [key: string]: number;
  }): string => {
    const sum = Object.values(complexities).reduce((a, b) => a + b, 0);
    var average = (sum / Object.values(complexities).length).toFixed(2);
    return average === "NaN" ? "Not Calculated" : average;
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
      {!loading && state.cyclomaticComplexities && (
        <>
          <h4>
            Average Cyclomatic Complexity:{" "}
            {getAverageComplexity(state.cyclomaticComplexities)}
          </h4>
          <h6>
            Last Calculated:{" "}
            {lastCalculated?.toLocaleString("en-GB") ?? "never"}
          </h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Method Name</th>
                <th>Method Type</th>
                <th>Cyclomatic Complexity</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                state.cyclomaticComplexities &&
                Object.keys(state.cyclomaticComplexities).map(
                  (methodKey, i) => (
                    <tr key={`${i}-tableRow`}>
                      <td>{i + 1}</td>
                      <td>{getFriendlyMethodName(methodKey)}</td>
                      <td>{getTypeForMethodName(methodKey)}</td>
                      <td>{state.cyclomaticComplexities![methodKey]}</td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </>
      )}
      {loading && <Loader />}
    </Container>
  );
};
