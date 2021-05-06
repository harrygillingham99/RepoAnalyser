import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { RepoFilterOptions, UserRepositoryResult } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect, useRef } from "react";
import {
  Card,
  Dropdown,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import useSetState from "react-use/lib/useSetState";
import { Loader } from "@components/BaseComponents/Loader";
import { ResponsiveGrid } from "@components/BaseComponents/ResponsiveGrid";
import { Link } from "react-router-dom";
import { addUrlParameters, Routes } from "@typeDefinitions/Routes";
import { getCardTitle } from "@utils/Strings";
import { X } from "react-bootstrap-icons";
import useListTransform, {
  MapTransformer,
  TransformerParams,
} from "use-list-transform";
import { ErrorScreen } from "@components/BaseComponents/ErrorScreen";

interface RepositoriesRouteState {
  repos: UserRepositoryResult[];
  repoFilterType: RepoFilterOptions;
  loading: boolean;
}
interface ITransformData {
  searchString?: string;
}
export const RepositoriesRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<RepositoriesRouteState>({
    repos: [],
    repoFilterType: RepoFilterOptions.All,
    loading: true,
  });

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        setState({ loading: true });
        var result = await authorisedApiClient(
          appState.token
        ).repository_Repositories(state.repoFilterType, buildUserInfo);
        setState({ repos: result });
      } catch (error) {
        showErrorAlert("Error", "Error fetching repositories");
      } finally {
        setState({ loading: false });
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.repoFilterType]);

  const filterBySearch: MapTransformer<UserRepositoryResult, ITransformData> = (
    params: TransformerParams<UserRepositoryResult, ITransformData>
  ) => (item: UserRepositoryResult) => {
    if (params.data?.searchString) {
      return (
        (item.name
          ?.toLowerCase()
          .indexOf(params.data.searchString!.toLowerCase()) ?? -1) >= 0 ||
        (item.description
          ?.toLowerCase()
          .indexOf(params.data.searchString.toLowerCase()) ?? -1) >= 0
      );
    }
    return true;
  };

  const { transformed, setData } = useListTransform<
    ITransformData,
    UserRepositoryResult
  >({
    list: state?.repos ?? new Array<UserRepositoryResult>(),
    transform: [filterBySearch],
  });

  const getButtonText = (filterOption: RepoFilterOptions) => {
    switch (filterOption) {
      case RepoFilterOptions.All:
        return "All Repos";
      case RepoFilterOptions.ContributedNotOwned:
        return "Repos Contributed To";
      case RepoFilterOptions.Owned:
        return "Owned Repos";
    }
  };

  return (
    <>
      <DashboardHeader text="Repositories" />
      <div className="container-fluid">
        <Row className="ml-auto">
          <Col className="ml-auto pl-0">
            <Dropdown>
              <Dropdown.Toggle variant="info">
                {getButtonText(state.repoFilterType)}
              </Dropdown.Toggle>
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
          </Col>
          <Col>
            <InputGroup className="mb-3">
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
                    setData({ searchString: undefined });
                  }}
                >
                  <X />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row className="ml-auto mr-auto">
          {state.repos &&
          state.repos.length > 0 &&
          !state.loading &&
          transformed ? (
            <ResponsiveGrid
              gridBuilder={{
                items: transformed,
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
          ) : state.repos && state.repos.length === 0 && !state.loading ? (
            <ErrorScreen
              title="No Repositories"
              message={`You have no repositories associated with your account.`}
              redirectSubtitle="Back"
              redirectTo={Routes.Landing}
              type="tabError"
            />
          ) : (
            <Loader />
          )}
        </Row>
      </div>
    </>
  );
};
