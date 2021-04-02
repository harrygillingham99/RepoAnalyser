import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { RepoFilterOptions, UserRepositoryResult } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect } from "react";
import { Card, Dropdown, Button } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";
import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";
import { Link } from "react-router-dom";
import { addUrlParameters, Routes } from "@typeDefinitions/Routes";
import { getCardTitle } from "@utils/Strings";

interface RepositoriesRouteState {
  repos: UserRepositoryResult[];
  repoFilterType: RepoFilterOptions;
}
export const RepositoriesRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = useSetState<RepositoriesRouteState>({
    repos: [],
    repoFilterType: RepoFilterOptions.All,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        var result = await authorisedApiClient(
          appState.token
        ).repository_Repositories(state.repoFilterType, buildUserInfo);
        setState({ repos: result });
      } catch (error) {
        showErrorAlert("Error", "Error fetching repositories");
      } finally {
        setLoading(false);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.repoFilterType]);

  const getHeaderText = (filterOption: RepoFilterOptions) => {
    switch (filterOption) {
      case RepoFilterOptions.All:
        return "All repositories";
      case RepoFilterOptions.ContributedNotOwned:
        return "Other people's repositories you've contributed to";
      case RepoFilterOptions.Owned:
        return "Your owned repositories";
    }
  };

  return (
    <>
      <DashboardHeader text={getHeaderText(state.repoFilterType)} />
      <div className="container-fluid">
        <Dropdown>
          <Dropdown.Toggle variant="info">Repository Filter</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                setState({ repoFilterType: RepoFilterOptions.All })
              }
            >
              All
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setState({ repoFilterType: RepoFilterOptions.Owned })
              }
            >
              Owned
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setState({
                  repoFilterType: RepoFilterOptions.ContributedNotOwned,
                })
              }
            >
              Contributed To
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {state.repos && state.repos.length > 0 && !loading ? (
          <ResponsiveGrid
            gridBuilder={{
              items: state.repos,
              mapToElemFunc: (repo) => (
                <Card key={`${repo.name}`} className="grid-card">
                  <Card.Header className="p-1">{`Last updated - ${repo.lastUpdated?.toDateString()}`}</Card.Header>
                  <Card.Title className="text-center">
                    {getCardTitle(repo.name)}
                  </Card.Title>
                  <Card.Subtitle className="m-1">
                    {repo.description ?? "No Description Set"}
                  </Card.Subtitle>
                  <Card.Footer className="mt-auto">
                    <Link
                      to={addUrlParameters(Routes.Repository, {
                        ":repoId": repo.id!.toString(),
                        ":repoName": repo.name!.toString(),
                      })}
                    >
                      <Button size="sm" variant="info">
                        Detailed View
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              ),
            }}
          />
        ) : state.repos && state.repos.length === 0 && !loading ? (
          <span>No Repositories</span>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};
