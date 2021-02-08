import { Routes } from "@typeDefinitions/Routes";
import React, { ComponentType } from "react";
import { Nav } from "react-bootstrap";
import { Link, Route, Switch } from "react-router-dom";
import "@styles/Nav.css";
import { LightbulbFill, Props } from "react-bootstrap-icons";

interface ISideBarItem {
  title: string;
  orderBy: number;
  Icon: ComponentType<Props>;
  onPress: () => void;
}

const HomeSidebarItems: ISideBarItem[] = [
  { title: "Home", orderBy: 1, Icon: LightbulbFill, onPress: () => undefined },
];

export const SideBar = () => {
  const getLinksForRoute = (route: Routes | undefined) => {
    switch (route) {
      case Routes.Home:
        return HomeSidebarItems.sort((a, b) => a.orderBy - b.orderBy).map(
          ({ title, Icon }) => (
            <li className="nav-item">
              <Link to={Routes.Home} className="nav-link">
                <Icon className="nav-link-icon" />
                {title}
              </Link>
            </li>
          )
        );
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
