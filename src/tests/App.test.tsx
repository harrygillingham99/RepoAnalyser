import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { TestId, waitForLoadThenAssert } from "./TestConstants";
import { BrowserRouter } from "react-router-dom";

test("renders side bar", () => {
  renderAppWithRouter();
  const sideNavElement = screen.getByTestId(TestId.SideBar);
  expect(sideNavElement).toBeInTheDocument();
});

test("renders home page on first load", () => {
  renderAppWithRouter();
  waitForLoadThenAssert(() => {
    const HomeRoute = screen.getByTestId(TestId.Dashboard);
    expect(HomeRoute).toBeInTheDocument();
  })
});

test("renders nav", () => {
  renderAppWithRouter();
  const NavBar = screen.getByTestId(TestId.Nav);
  expect(NavBar).toBeInTheDocument();
});

const renderAppWithRouter = () =>
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
