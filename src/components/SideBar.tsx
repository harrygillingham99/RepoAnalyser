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
}

const HomeSidebarItems: ISideBarItem[] = [
  { title: "Home", orderBy: 1, Icon: LightbulbFill },
];

export const SideBar = () => {
  return (
    <Switch>
      <Route path={Routes.Home}>
        <div className="sidebar-sticky">
          <Nav as="ul" className="flex-column">
            {HomeSidebarItems.sort((a, b) => a.orderBy - b.orderBy).map(
              ({ title, Icon }) => (
                <li className="nav-item">
                  <Link to={Routes.Home} className="nav-link">
                    <Icon className="nav-link-icon" />
                    {title}
                  </Link>
                </li>
              )
            )}
          </Nav>
        </div>
      </Route>
    </Switch>
  );
};
