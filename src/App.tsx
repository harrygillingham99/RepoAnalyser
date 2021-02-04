import React from "react";
import "@styles/App.css";
import { apiClient } from "@services/api/Index";
import { buildUserInfo } from "@utils/ClientInfo";
import logo from "@assets/logo.svg";

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
        <img src={logo} className="App-logo" alt="logo" />
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
