import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import {
  PullRequestFilterOption,
  UserPullRequestResult,
} from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";
import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";
import React from "react";
import { addUrlParameters, Routes } from "@typeDefinitions/Routes";
import { Link } from "react-router-dom";
import { getCardTitle } from "@utils/Strings";
import useListTransform, {
  MapTransformer,
  TransformerParams,
} from "use-list-transform";
import { distinctProperty } from "@utils/Array";
import { X } from "react-bootstrap-icons";
import { ErrorScreen } from "@components/BaseComponents/ErrorScreen";

interface PullRequestRouteState {
  pulls: UserPullRequestResult[];
  filterOption: PullRequestFilterOption;
}
interface ITransformData {
  repo?: string;
  searchString?: string;
}
export const PullRequestRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<PullRequestRouteState>({
    pulls: [],
    filterOption: PullRequestFilterOption.All,
  });
  const [loading, toggleLoading] = React.useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const filterByProperty: MapTransformer<
    UserPullRequestResult,
    ITransformData
  > = (params: TransformerParams<UserPullRequestResult, ITransformData>) => (
    item: UserPullRequestResult
  ) => {
    if (params.data?.repo) {
      return params.data.repo === item.repositoryName;
    }
    if (params.data?.searchString) {
      return (
        item
          .title!.toLowerCase()
          .indexOf(params.data.searchString!.toLowerCase()) >= 0 ||
        item
          .description!.toLowerCase()
          .indexOf(params.data.searchString.toLowerCase()) >= 0
      );
    }
    return true;
  };

  const { transformed, setData, transformData } = useListTransform<
    ITransformData,
    UserPullRequestResult
  >({
    list: state?.pulls ?? new Array<UserPullRequestResult>(),
    transform: [filterByProperty],
    onLoading: (loading: boolean) => toggleLoading(loading),
  });

  useEffect(() => {
    (async () => {
      try {
        toggleLoading(true);
        var result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetPullRequests(state.filterOption, buildUserInfo);
        setState({ pulls: result });
      } catch (error) {
        showErrorAlert("Error", "Error fetching pull requests");
      } finally {
        toggleLoading(false);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.filterOption]);

  return (
    <>
      <DashboardHeader text={`Pull Requests`} />
      <Row className="ml-auto">
        <Col sm className="ml-auto">
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle variant="info">{`${
                PullRequestFilterOption[state.filterOption]
              } Pull Requests`}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    setState({ filterOption: PullRequestFilterOption.All })
                  }
                >
                  All
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setState({ filterOption: PullRequestFilterOption.Closed })
                  }
                >
                  Closed
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setState({ filterOption: PullRequestFilterOption.Open })
                  }
                >
                  Open
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setState({ filterOption: PullRequestFilterOption.Merged })
                  }
                >
                  Merged
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="ml-1">
              <Dropdown.Toggle variant="info">
                {transformData?.repo ?? "All Repositories"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setData({ repo: undefined })}>
                  All
                </Dropdown.Item>
                {distinctProperty(
                  state.pulls,
                  (pull) => pull.repositoryName
                ).map((repoName) => (
                  <Dropdown.Item
                    onClick={() => setData({ repo: repoName })}
                    key={`repoFilter-${repoName}`}
                  >
                    {repoName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="ml-1"
              variant="info"
              title="Reset Filters"
              onClick={() => {
                setState({ filterOption: PullRequestFilterOption.All });
                setData({ repo: undefined, searchString: undefined });
                if (searchRef.current?.value) {
                  searchRef.current.value = "";
                }
              }}
            >
              Clear Filters
            </Button>
          </ButtonGroup>
        </Col>
        <Col sm={6}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search"
              aria-label="Search"
              ref={searchRef}
              onChange={(ev) => setData({ searchString: ev.target.value })}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                className="mr-3"
                onClick={() => {
                  if (searchRef.current?.value) {
                    searchRef.current.value = "";
                  }
                  setData({ searchString: undefined });
                }}
              >
                <X />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <div className="container-fluid">
        {state.pulls && transformed.length > 0 && !loading ? (
          <>
            <ResponsiveGrid
              gridBuilder={{
                items: transformed,
                mapToElemFunc: (pull) => (
                  <Card
                    key={`${pull.pullRequestNumber}-${pull.repositoryId}`}
                    className="grid-card"
                  >
                    <Card.Header className="p-1">{`Last Updated - ${pull.updatedAt?.toDateString()}`}</Card.Header>
                    <Card.Title className="text-center">
                      {getCardTitle(pull.title)}
                    </Card.Title>
                    <Card.Subtitle>For: {pull.repositoryName}</Card.Subtitle>
                    <Card.Body className="p-0 overflow-auto">
                      {pull.description ?? "No Description Set"}
                    </Card.Body>
                    <Card.Footer className="mt-auto">
                      <>
                        <Link
                          to={addUrlParameters(Routes.PullRequest, {
                            ":repoId": pull.repositoryId!.toString(),
                            ":pullRequest": pull.pullRequestNumber!.toString(),
                            ":repoName": pull.repositoryName!.toString(),
                          })}
                        >
                          <Button variant="info" size="sm">
                            Detailed View
                          </Button>
                        </Link>
                      </>
                    </Card.Footer>
                  </Card>
                ),
              }}
            />
          </>
        ) : state.pulls && transformed.length === 0 && !loading ? (
          <ErrorScreen
            title="No Pull Requests"
            message={`You have no historic or active pull requests to show.`}
            redirectSubtitle="Back"
            redirectTo={Routes.Landing}
            type="tabError"
          />
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};
