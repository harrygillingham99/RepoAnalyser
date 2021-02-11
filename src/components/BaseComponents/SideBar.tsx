import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "@styles/Nav.css";
import {
  HomeSidebarItems,
  ISideBarItem,
  TestSidebarItems,
} from "@typeDefinitions/SidebarItems";

export const SideBar = () => {
  const { pathname } = useLocation();
  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon }) => (
        <li className="nav-item" key={`${title}-${pathname}-nav-item`}>
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
      case Routes.Test:
        return generateLinksForItems(TestSidebarItems);
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
        {getLinksForRoute(pathname as Routes)}
      </Nav>
    </div>
  );
};
