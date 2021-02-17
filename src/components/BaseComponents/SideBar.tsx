import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "@styles/Nav.scss";
import {
  HomeSidebarItems,
  ISideBarItem,
  AccountSidebarItems,
} from "@typeDefinitions/SidebarItems";
import { AppContainer } from "@state/AppStateContainer";
import { RedirectContainer } from "@state/RedirectContainer";
import { ConditonalWrapper } from "./ConditionalWrapper";
import { AuthorizedRoutes } from "@constants/RouteConstants";

export const SideBar = () => {
  const { pathname } = useLocation();
  const { redirectToRoute } = RedirectContainer.useContainer();
  const { signOut, appState } = AppContainer.useContainer();

  const isUnauthorised =
    !appState.user && AuthorizedRoutes.indexOf(pathname as Routes) >= 0;

  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon, onPress, href }) => (
        <ConditonalWrapper
          condition={href !== undefined}
          wrapper={(children) => <a href={href}>{children}</a>}
        >
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
        </ConditonalWrapper>
      ));
  };
  const getLinksForRoute = (route: Routes | undefined) => {
    switch (route) {
      case Routes.Home:
        return generateLinksForItems(HomeSidebarItems());
      case Routes.Account:
        return generateLinksForItems(
          AccountSidebarItems({ signOut: () => signOut(redirectToRoute) })
        );
      default:
        return (
          <li className="nav-item">
            <span className="nav-link">No Links Available</span>
          </li>
        );
    }
  };

  return (
    <div className="sidebar-sticky">
      <Nav as="ul" className="flex-column list-group list-group-flush">
        {getLinksForRoute(isUnauthorised ? undefined : (pathname as Routes))}
      </Nav>
    </div>
  );
};
