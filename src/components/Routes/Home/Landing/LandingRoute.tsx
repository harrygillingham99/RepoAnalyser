import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { AppContainer } from "@state/AppStateContainer";
import { Container } from "react-bootstrap";

export const LandingRoute = () => {
  const { appState } = AppContainer.useContainer();
  return appState?.user === undefined ? (
    <DashboardHeader text={`Welcome please log in`} />
  ) : (
    <>
      <DashboardHeader
        text={`Welcome ${
          appState.user.name ?? appState.user.login ?? "GitHub User"
        }`}
        subtitle={`Public Repos: ${appState.user.publicRepos}   Private Repos: ${appState.user.ownedPrivateRepos}`}
        imageUrl={appState.user.avatarUrl}
      />
      <Container fluid>
        <p>Welcome to RepoAnalyser</p>
      </Container>
    </>
  );
};
