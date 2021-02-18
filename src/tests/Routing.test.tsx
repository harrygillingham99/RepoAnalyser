import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { BrowserRouter, Router } from "react-router-dom";
import { Dashboard } from "@components/BaseComponents/Dashboard";
import { AppContainer } from "@state/AppStateContainer";
import { TestId } from "./TestConstants";
import App from "../App";
import { Routes } from "@typeDefinitions/Routes";

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

test("authentication route renders handler", () => {
  const history = createMemoryHistory();
  history.push(Routes.CallbackUrl);
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

test("redirect handler not rendered by default", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.queryByTestId(TestId.RedirectHandler)).not.toBeInTheDocument();
});
