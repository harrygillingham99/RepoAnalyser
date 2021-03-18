import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { createMemoryHistory } from "history";
import { TestId, waitForLoadThenAssert } from "./TestConstants";
import { Routes } from "@typeDefinitions/Routes";
import { Router } from "react-router-dom";

test("Side nav items disabled when not authenticated", () => {
  const history = createMemoryHistory();
  history.push(Routes.Landing);
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  waitForLoadThenAssert(() => {
    const elems = screen.getAllByTestId(TestId.SideBarRowItem);
    elems.forEach((navItem) => {
      expect(navItem).toHaveClass(navItem.innerText !== "Home" ? "disabled":"clickable")
    });
  });
});

test("Side nav no items on unknown routes", () => {
  const history = createMemoryHistory();
  history.push(`dfabvdgfbfsg`);
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  waitForLoadThenAssert(() => {
    const elem = screen.getByTestId(TestId.SideBarRowItem);
    expect(elem.innerText).toBe("No Links Available");
  });
});
