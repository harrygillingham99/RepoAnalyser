import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "@styles/Nav.scss";
import {
  HomeSidebarItems,
  ISideBarItem,
  AccountSidebarItems,
} from "@typeDefinitions/SidebarItems";
import { AppContainer } from "@state/AppStateContainer";
import { RedirectContainer } from "@state/RedirectContainer";
import { WrapChildrenIf } from "./WrapChildrenIf";
import { AuthorizedRoutes } from "@constants/RouteConstants";
import { TestId } from "@tests/TestConstants";
import { splitPath } from "@utils/Urls";

export const SideBar = () => {
  const { pathname } = useLocation();
  const { redirectToRoute } = RedirectContainer.useContainer();
  const { signOut, appState } = AppContainer.useContainer();
  const basePathName = splitPath(pathname);

  const canViewRoute = (path: string) =>
    (appState.user === undefined && AuthorizedRoutes.indexOf(path) < 0) ||
    appState.user !== undefined;

  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon, onPress, linkTo, forRoute }) => {
        const isActiveLink =
          linkTo !== undefined && pathname === `${forRoute}${linkTo}`;
        const shouldWrapInAnchor =
          linkTo !== undefined && canViewRoute(`${forRoute}${linkTo}`);
        return (
          <WrapChildrenIf
            condition={shouldWrapInAnchor}
            wrapper={(children) => (
              <Link to={`${forRoute}${linkTo}`}>{children}</Link>
            )}
            key={`${title}-${pathname}-nav-item`}
          >
            <li
              className={`nav-item ${
                shouldWrapInAnchor || linkTo === undefined
                  ? "clickable"
                  : "disabled"
              } ${linkTo === undefined ? "list-group-item-action" : ""}`}
              onClick={onPress}
              data-testid={TestId.SideBarRowItem}
            >
              <span className={`nav-link ${isActiveLink ? "active" : ""}`}>
                <Icon className="nav-link-icon" />
                {title}
              </span>
            </li>
          </WrapChildrenIf>
        );
      });
  };

  const getLinksForRoute = (route: Routes | undefined) => {
    switch (route) {
      case Routes.Home:
        return generateLinksForItems(HomeSidebarItems);
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
    <div className="sidebar-sticky" data-testid={TestId.SideBar}>
      <Nav as="ul" className="flex-column list-group list-group-flush">
        {getLinksForRoute(
          !appState.loading && canViewRoute(basePathName)
            ? (basePathName as Routes)
            : undefined
        )}
      </Nav>
    </div>
  );
};
