import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "@styles/Nav.css";
import {
  HomeSidebarItems,
  ISideBarItem,
  AccountSidebarItems,
} from "@typeDefinitions/SidebarItems";
import { AppContainer } from "@state/AppStateContainer";

export const SideBar = () => {
  const { pathname } = useLocation();
  const { signOut } = AppContainer.useContainer();

  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon, onPress }) => (
        <li
          className="nav-item list-group-item-action clickable"
          key={`${title}-${pathname}-nav-item`}
          onClick={onPress}
        >
          <span className="nav-link">
            <Icon className="nav-link-icon" />
            {title}
          </span>
        </li>
      ));
  };
  const getLinksForRoute = (route: Routes | undefined) => {
    switch (route) {
      case Routes.Home:
        return generateLinksForItems(HomeSidebarItems());
      case Routes.Account:
        return generateLinksForItems(AccountSidebarItems({ signOut: signOut }));
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
      <Nav as="ul" className="flex-column list-group list-group-flush">
        {getLinksForRoute(pathname as Routes)}
      </Nav>
    </div>
  );
};
