import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { RepoFilterOptions, UserRepositoryResult } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useEffect } from "react";
import { Card, Dropdown } from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";
import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";

interface RepositoriesRouteState {
  repos: UserRepositoryResult[];
  repoFilterType: RepoFilterOptions;
}
export const RepositoriesRoute = () => {
  const { appState, toggleLoading } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<RepositoriesRouteState>({
    repos: [],
    repoFilterType: RepoFilterOptions.All,
  });

  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    try {
      toggleLoading(true);
      (async () => {
        var result = await authorisedApiClient(
          appState.token
        ).repository_Repositories(state.repoFilterType, buildUserInfo());
        setState({ repos: result });
      })();
    } catch (error) {
      showErrorAlert("Error", "Error fetching repositories");
    } finally {
      toggleLoading(false);
    }
  }, [state.repoFilterType]);
  /* eslint-enable react-hooks/exhaustive-deps*/

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
        <Dropdown className="">
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
        {state.repos && state.repos !== [] ? (
          <ResponsiveGrid
            gridBuilder={{
              items: state.repos,
              mapToElemFunc: (repo) => (
                <Card
                  key={`${repo.name}`}
                  style={{ height: "300px", background: "#e9ecef" }}
                >
                  <Card.Header className="p-1">{`Last updated - ${repo.lastUpdated?.toDateString()}`}</Card.Header>
                  <Card.Title className="text-center">{repo.name}</Card.Title>
                  <Card.Subtitle className="m-1">
                    {repo.description ?? "No Description Set"}
                  </Card.Subtitle>
                  <Card.Link href={repo.pullUrl}>GitHub Url</Card.Link>
                </Card>
              ),
            }}
          />
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};
