import { Loader } from "@components/BaseComponents/Loader";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";

interface IStaticAnalysisProps {
  repoId: number;
  lastCalculatedHook: [
    lastCalculated: Date | undefined,
    updateLastCalculated: (when: Date) => void
  ];
  htmlStringHook: [
    report: string | undefined,
    setReport: (report: string) => void
  ];
}

interface IStaticAnalysisState {
  loading: boolean;
}

export const StaticAnalysis = (props: IStaticAnalysisProps) => {
  const [state, setState] = useSetState<IStaticAnalysisState>({
    loading: false,
  });
  const [lastCalculated, updateLastCalculated] = props.lastCalculatedHook;
  const [report, setReport] = props.htmlStringHook;
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();

  const recalculateReport = async () => {
    try {
      setState({ loading: true });
      const result = await authorisedApiClient(
        appState.token
      ).repository_GetGendarmeReportHtml(
        props.repoId,
        appState.connection.connectionId ?? "",
        buildUserInfo
      );
      setReport(result);
      updateLastCalculated(new Date(Date.now()));
    } catch (error) {
      showErrorAlert("Error", "Error generating static analysis report");
    } finally {
      setState({ loading: false });
    }
  };
  return (
    <Container fluid>
      {!state.loading ? (
        <>
          <Row className=" mt-1 ml-auto mr-auto">
            <Col className="m-0 p-0">
              <Button
                className="mb-2"
                variant="info"
                onClick={() => recalculateReport()}
              >
                Run Static Analysis
              </Button>
              <h5>
                Last Calculated:{" "}
                {lastCalculated?.toLocaleString("en-GB") ?? "never"}
              </h5>
            </Col>
          </Row>
          <Row className="ml-auto mr-auto">
            <div
              className="container-fluid ml-auto p-0 mr-auto overflow-hidden gendarme-report"
              dangerouslySetInnerHTML={{
                __html: report ?? "No Report",
              }}
            />
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
};
