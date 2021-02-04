import { AppContainer } from "@state/AppState";

export const Dashboard = () => {
  const { state } = AppContainer.useContainer();
  return (
    <div>
      <p>logged in: {state.token ?? "nope"}</p>
    </div>
  );
};
