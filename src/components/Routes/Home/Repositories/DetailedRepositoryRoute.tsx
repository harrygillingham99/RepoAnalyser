import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { DetailedRepository } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import { Button } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { useEffectOnce, useSetState } from "react-use";

interface RouteParams {
  repoId: string;
}

interface DetailedRepositoryRouteState {
  repo: DetailedRepository;
  codeOwners?: { [key: string]: string };
}

export const DetailedRepositoryRoute = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const params = useParams<RouteParams>();
  const repoId = Number.parseInt(params.repoId);
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<DetailedRepositoryRouteState>({
    repo: undefined!,
    codeOwners: undefined,
  });

  useEffectOnce(() => {
    (async () => {
      try {
        if (!appState.token) return;
        setLoading(true);
        const result = await authorisedApiClient(
          appState.token
        ).repository_GetDetailedRepository(repoId, buildUserInfo);
        setState({ repo: result });
      } catch (error) {
        showErrorAlert(
          "Error",
          "Error getting detailed repository information"
        );
      } finally {
        setLoading(false);
      }
    })();
  });

  const calculateCodeOwners = async () => {
    if (!state.repo || !state.repo.repository || !state.repo.repository.id)
      return;
    setLoading(true);
    var result = await authorisedApiClient(
      appState.token
    ).repository_GetCodeOwnersForRepo(
      state.repo.repository.id,
      appState.connection.connectionId ?? "",
      buildUserInfo
    );
    setState({ codeOwners: result });
    setLoading(false);
  };

  return appState.token === undefined ? (
    <Redirect to={Routes.Landing} />
  ) : (
    <>
      <DashboardHeader text={state.repo?.repository?.name ?? ""} />
      <Button variant="info" onClick={() => calculateCodeOwners()}>
        Calculate code owners
      </Button>
      {loading && <Loader />}
      {state.repo && !loading && <>{JSON.stringify(state.repo)}</>}
      {state.codeOwners && !loading && (
        <>
          {Object.keys(state.codeOwners).map((file) => (
            <p>
              {file} owned by {state.codeOwners![file] ?? "unknown"}
            </p>
          ))}
        </>
      )}
    </>
  );
};
