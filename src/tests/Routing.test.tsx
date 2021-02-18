import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Dashboard } from "@components/BaseComponents/Dashboard";
import { AppContainer } from "@state/AppStateContainer";

test("bad routes result in 404 page", () => {
  const history = createMemoryHistory();
  history.push("/thisisanunhandledroute");
  render(
    <Router history={history}>
      <AppContainer.Provider>
        <Dashboard />
      </AppContainer.Provider>
    </Router>
  );

  const elems = screen.getAllByText(/Not Found/i);
  expect(elems[0]).toBeInTheDocument();
});
