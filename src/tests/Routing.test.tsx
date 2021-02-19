import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { BrowserRouter, Router } from "react-router-dom";
import { TestId } from "./TestConstants";
import App from "../App";
import { Routes } from "@typeDefinitions/Routes";

test("bad routes result in 404 page", () => {
  const history = createMemoryHistory();
  history.push("/ThisIsAnUnhandledRoute");
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const elems = screen.getAllByText(/Not Found/i);
  expect(elems[0]).toBeInTheDocument();
});

test("bad sub route still results in 404 page", () => {
  const history = createMemoryHistory();
  history.push(`${Routes.Home}/unhandledSubRoute`);
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const elems = screen.getAllByText(/Not Found/i);
  expect(elems[0]).toBeInTheDocument();
});

test("unauthenticated page when not logged in", () => {
  const history = createMemoryHistory();
  history.push(Routes.Account);
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const elems = screen.getAllByText(/Unauthorised/i);
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
