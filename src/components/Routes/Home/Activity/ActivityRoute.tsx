import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { UserActivity } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import { useState } from "react";
import { useEffectOnce, useSetState } from "react-use";

interface IActivityRouteState {
  userActivity: UserActivity;
}
export const ActivityRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<IActivityRouteState>({
    userActivity: undefined!,
  });
  const [loading, setLoading] = useState(false);

  useEffectOnce(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await authorisedApiClient(
          appState.token
        ).statistics_GetUserStatistics(buildUserInfo);
        setState({ userActivity: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting user activity information");
      } finally {
        setLoading(false);
      }
    })();
  });
  return (
    <>
      <DashboardHeader text="Activity" />{" "}
      {!loading && JSON.stringify(state.userActivity)}
      {loading && <Loader />}
    </>
  );
};
