import React from "react";
import "@/App.css";
import { apiClient } from "@services/api";
import { buildUserInfo } from "@utils/userInfo";

const App = () => {
  const [state, setState] = React.useState<object>();

  React.useEffect(() => {
    (async () => {
      const x = await apiClient.repository_Test(200, buildUserInfo());
      console.log(x);
      setState(x);
    })();
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={require("@/logo.svg")} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{JSON.stringify(state)}</p>
      </header>
    </div>
  );
};

export default App;
