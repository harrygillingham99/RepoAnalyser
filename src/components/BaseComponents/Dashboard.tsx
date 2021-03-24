import { SettingsRoute } from "@components/Routes/Settings/SettingsRoute";
import { AuthorizedRoutes, HomeRoutes } from "@typeDefinitions/Routes";
import { AppContainer } from "@state/AppStateContainer";
import { TestId } from "@tests/TestConstants";
import { Routes } from "@typeDefinitions/Routes";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { HomeRoute } from "../Routes/Home/HomeRoute";
import { Loader } from "./Loader";
import { useEffectOnce } from "react-use";
import { SignalRNotificationType } from "@services/api/Client";
import { AlertContainer } from "@state/AlertContainer";

export const Dashboard = () => {
  const { pathname } = useLocation();
  const { appState } = AppContainer.useContainer();
  const { showInfoAlert, hideAlert } = AlertContainer.useContainer();
  const { loading } = appState;

  //Add SignalR notification event handlers here
  useEffectOnce(() => {
    appState.connection.on(
      "DirectNotification",
      (user: string, message: string, type: SignalRNotificationType) => {
        console.log(`Message Recieved ${user} ${message} ${type}`);
        switch (type) {
          case SignalRNotificationType.PullRequestAnalysisProgressUpdate:
            showInfoAlert("Pull Request Analysis", message);
            break;
          case SignalRNotificationType.RepoAnalysisProgressUpdate:
            showInfoAlert("Repository Analysis", message);
            break;
          case SignalRNotificationType.RepoAnalysisDone:
            showInfoAlert("Repository Analysis Complete", message);
            setTimeout(() => hideAlert(), 4000);
            break;
          case SignalRNotificationType.PullRequestAnalysisDone:
            showInfoAlert("Pull Request Analysis Complete", message);
            setTimeout(() => hideAlert(), 4000);
        }
      }
    );
  });

  if (
    !loading &&
    !appState.user &&
    AuthorizedRoutes.indexOf(pathname as Routes) >= 0
  ) {
    return <Redirect to={Routes.Unauthorised} />;
  }

  return loading ? (
    <Loader />
  ) : (
    <div data-testid={TestId.Dashboard}>
      <Switch>
        <Route path={HomeRoutes}>
          <HomeRoute />
        </Route>
        <Route path={Routes.Settings}>
          <SettingsRoute />
        </Route>
      </Switch>
    </div>
  );
};
