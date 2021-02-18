import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { TestId } from "./TestConstants";

test("renders side bar", () => {
  render(<App />);
  const sideNavElement = screen.getByTestId(TestId.SideBar);
  expect(sideNavElement).toBeInTheDocument();
});

test("renders home page on first load", () => {
  render(<App />);
  const HomeRoute = screen.getByTestId(TestId.Dashboard);
  expect(HomeRoute).toBeInTheDocument();
});

test("renders nav", () => {
  render(<App />);
  const NavBar = screen.getByTestId(TestId.Nav);
  expect(NavBar).toBeInTheDocument();
});
