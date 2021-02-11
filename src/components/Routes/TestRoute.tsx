import { AppContainer } from "@state/AppStateContainer";

export const TestRoute = () => {
  const { appState } = AppContainer.useContainer();
  return (
    <div>
      <p>TEST ROUTE! {JSON.stringify(appState)}</p>
    </div>
  );
};
