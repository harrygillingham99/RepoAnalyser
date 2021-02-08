import { AppContainer } from "@state/AppStateContainer";

export const HomeRoute = () => {
  const { state } = AppContainer.useContainer();
  return (
    <div>
      <p>logged in: {state.token ?? "nope"}</p>
    </div>
  );
};
