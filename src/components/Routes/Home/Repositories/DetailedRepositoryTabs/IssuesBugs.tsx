import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";
import { Issue, ItemState, RepoIssuesResponse } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { capitalizeFirstLetter, getCardTitle } from "@utils/Strings";
import React from "react";
import {
  Card,
  Container,
  Dropdown,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Modal,
} from "react-bootstrap";
import { X, Bug, Book, Star, QuestionCircle } from "react-bootstrap-icons";
import { useEffectOnce, useSetState } from "react-use";
import useListTransform, {
  MapTransformer,
  TransformerParams,
} from "use-list-transform";

interface IssuesBugsProps {
  repoId: number;
}

interface IssuesBugsState {
  issues: RepoIssuesResponse;
  loading: boolean;
  selectedIssue?: Issue;
}

interface ITransformData {
  state?: ItemState;
  searchString?: string;
}

export const IssuesBugs = (props: IssuesBugsProps) => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<IssuesBugsState>();

  const filterByProperty: MapTransformer<Issue, ITransformData> = (
    params: TransformerParams<Issue, ITransformData>
  ) => (item: Issue) => {
    if (params.data?.state) {
      return params.data.state === item.state?.value;
    }

    return true;
  };

  const searchRef = React.useRef<HTMLInputElement>(null);

  const filterBySearch: MapTransformer<Issue, ITransformData> = (
    params: TransformerParams<Issue, ITransformData>
  ) => (item: Issue) => {
    if (params.data?.searchString) {
      return (
        (item.title
          ?.toLowerCase()
          .indexOf(params.data.searchString!.toLowerCase()) ?? -1) >= 0 ||
        (item.body
          ?.toLowerCase()
          .indexOf(params.data.searchString.toLowerCase()) ?? -1) >= 0
      );
    }
    return true;
  };

  const { transformed, setData } = useListTransform<ITransformData, Issue>({
    list: state?.issues?.issues ?? new Array<Issue>(),
    transform: [filterByProperty, filterBySearch],
  });

  useEffectOnce(() => {
    (async () => {
      try {
        setState({ loading: true });
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetRepoIssues(props.repoId, buildUserInfo);
        setState({ issues: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting issues for repository.");
      } finally {
        setState({ loading: false });
      }
    })();
  });

  const getIssueModalHeading = (issueType: string) => {
    return (
      <div className="modal-header d-flex justify-content-between align-items-center">
        {issueType === "bug" && <Bug height={40} width={40} />}
        {issueType === "documentation" && <Book height={40} width={40} />}
        {issueType === "enhancement" && <Star height={40} width={40} />}
        {issueType === "question" && <QuestionCircle height={40} width={40} />}
        <h5 className="modal-title modal-title-filter" id="exampleModalLabel">
          {capitalizeFirstLetter(issueType)} Details
        </h5>
        <button
          type="button"
          className="close ml-0"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setState({ selectedIssue: undefined })}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  };

  const getIssueStats = (
    issues: Issue[],
    type: "opened" | "closed"
  ): number => {
    const login = appState.user.login;
    if (!login) return 0;
    switch (type) {
      case "opened":
        return issues.filter(
          (is) => is.user?.login !== undefined && is.user.login === login
        ).length;
      case "closed":
        return issues.filter(
          (is) => is.closedBy !== undefined && is.closedBy.login === login
        ).length;
      default:
        return 0;
    }
  };

  return !state.loading &&
    state.issues &&
    state.issues.issues &&
    (state.issues.issues?.length ?? 0) > 0 ? (
    <Container fluid>
      <Row className="mt-1 ml-auto mr-auto">
        <Col className="pl-0">
          <Dropdown>
            <Dropdown.Toggle variant="info">Issue State</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setData({ state: undefined })}>
                All
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setData({ state: ItemState.Closed })}
              >
                Closed
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setData({ state: ItemState.Open })}>
                Open
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              ref={searchRef}
              placeholder="Search"
              aria-label="Search"
              onChange={(ev) => setData({ searchString: ev.target.value })}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  if (searchRef.current?.value) {
                    searchRef.current.value = "";
                  }
                  setData({ searchString: undefined, state: undefined });
                }}
              >
                <X />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-1 ml-auto mr-auto">
        <Col className="pl-0">
          <h5>Raised By You: {getIssueStats(state.issues.issues, "opened")}</h5>
          <h5>Closed By You: {getIssueStats(state.issues.issues, "closed")}</h5>
        </Col>
      </Row>
      <ResponsiveGrid
        gridBuilder={{
          items: transformed,
          mapToElemFunc: (issue) => (
            <Card key={`${issue.id}`} className="grid-card">
              <Card.Header className="p-1">{`Last updated - ${issue.updatedAt?.toDateString()}`}</Card.Header>
              <Card.Title className="text-center">
                {getCardTitle(issue.title)}
              </Card.Title>
              <Card.Subtitle className="m-1">
                {issue.body ?? "No Description Set"}
                {issue.closedAt && issue.closedBy && (
                  <p className="mt-1">{`Closed at: ${issue.closedAt} By: ${issue.closedBy}`}</p>
                )}
              </Card.Subtitle>
              <Card.Footer className="mt-auto">
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => setState({ selectedIssue: issue })}
                >
                  Detailed View
                </Button>
              </Card.Footer>
            </Card>
          ),
        }}
      />
      {state.selectedIssue && (
        <Modal
          size="lg"
          centred={true}
          show={true}
          onHide={() => setState({ selectedIssue: undefined })}
        >
          {getIssueModalHeading(
            (state.selectedIssue.labels &&
              state.selectedIssue.labels[0]?.name) ??
              "issue"
          )}
          <Modal.Body>
            <h4>{state.selectedIssue.title}</h4>
            <p>{state.selectedIssue.body ?? "No Description"}</p>
            {state.selectedIssue.assignees &&
            state.selectedIssue.assignees.length > 0 ? (
              <>
                <h5>Assignees:</h5>
                {state.selectedIssue.assignees.map((usr) => (
                  <p>{usr.login}</p>
                ))}
              </>
            ) : (
              <h5>Nobody is assigned to this issue.</h5>
            )}
            {state.selectedIssue.closedAt && state.selectedIssue.closedBy && (
              <h5>
                Closed at:{" "}
                {state.selectedIssue.closedAt.toLocaleDateString("en-GB")} By:{" "}
                {state.selectedIssue.closedBy}
              </h5>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setState({ selectedIssue: undefined })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  ) : !state.loading && state.issues?.issues?.length === 0 ? (
    <span>No Issues</span>
  ) : (
    <Loader />
  );
};
