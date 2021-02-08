import { AppContainer } from "@state/AppStateContainer";

export const HomeRoute = () => {
  const { appState } = AppContainer.useContainer();
  return (
    <div>
      <p>{JSON.stringify(appState)}</p>
    </div>
  );
};
