import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { AppContainer } from "@state/AppStateContainer";

export const LandingRoute = () => {
  const { appState } = AppContainer.useContainer();
  return (
    <DashboardHeader
      text={`Welcome ${appState?.user?.name ?? "please log in"}`}
    />
  );
};
