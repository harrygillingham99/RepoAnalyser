import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, Route, Switch } from "react-router-dom";
import "@styles/Nav.css";
import { HomeSidebarItems, ISideBarItem } from "@typeDefinitions/SidebarItems";

export const SideBar = () => {
  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon }) => (
        <li className="nav-item">
          <Link to={Routes.Home} className="nav-link">
            <Icon className="nav-link-icon" />
            {title}
          </Link>
        </li>
      ));
  };
  const getLinksForRoute = (route: Routes | undefined) => {
    switch (route) {
      case Routes.Home:
        return generateLinksForItems(HomeSidebarItems);
      default:
        return (
          <li className="nav-item">
            <span>No Links Available</span>
          </li>
        );
    }
  };
  return (
    <div className="sidebar-sticky">
      <Nav as="ul" className="flex-column">
        <Switch>
          <Route path={Routes.Home}>{getLinksForRoute(Routes.Home)}</Route>
          <Route>{getLinksForRoute(undefined)}</Route>
        </Switch>
      </Nav>
    </div>
  );
};
