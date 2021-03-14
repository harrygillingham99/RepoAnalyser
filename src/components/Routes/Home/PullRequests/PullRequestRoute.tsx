import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import {
  PullRequestFilterOption,
  UserPullRequestResult,
} from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffect } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";
import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";
import React from "react";
import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";
import { Link } from "react-router-dom";

interface PullRequestRouteState {
  pulls: UserPullRequestResult[];
  filterOption: PullRequestFilterOption;
}
export const PullRequestRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<PullRequestRouteState>({
    pulls: [],
    filterOption: PullRequestFilterOption.All,
  });
  const [loading, toggleLoading] = React.useState(false);

  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    (async () => {
      try {
        toggleLoading(true);
        var result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetPullRequests(state.filterOption, buildUserInfo());
        setState({ pulls: result });
      } catch (error) {
        showErrorAlert("Error", "Error fetching repositories");
      } finally {
        toggleLoading(false);
      }
    })();
  }, [state.filterOption]);
  /* eslint-enable react-hooks/exhaustive-deps*/
  return (
    <>
      <DashboardHeader
        text={`${PullRequestFilterOption[state.filterOption]} pull requests`}
      />
      <div className="container-fluid">
        <Dropdown className="">
          <Dropdown.Toggle variant="info">Repository Filter</Dropdown.Toggle>
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
        {state.pulls && state.pulls.length > 0 && !loading ? (
          <ResponsiveGrid
            gridBuilder={{
              items: state.pulls,
              mapToElemFunc: (pull) => (
                <Card
                  key={`${pull.title}`}
                  style={{ height: "300px", background: "#e9ecef" }}
                >
                  <Card.Header className="p-1">{`Last Updated - ${pull.updatedAt?.toDateString()}`}</Card.Header>
                  <Card.Title className="text-center">{pull.title}</Card.Title>
                  <Card.Subtitle className="m-1">
                    {pull.description ?? "No Description Set"}
                  </Card.Subtitle>
                  <Card.Body className="p-0"></Card.Body>
                  <Card.Footer className="mt-auto">
                    <>
                      {/*TODO: wire up detailed pull request link */}
                      <Link
                        to={`${Routes.Home}${HomeSubRoutes.PullRequest}`
                          .replace(":repoId", pull.repositoryId!.toString())
                          .replace(
                            ":pullRequest",
                            pull.pullRequestNumber!.toString()
                          )}
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
        ) : state.pulls && state.pulls.length === 0 && !loading ? (
          <span>No PR's </span>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};
