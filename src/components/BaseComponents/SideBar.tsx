import { HomeRoutes, Routes } from "@typeDefinitions/Routes";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "@styles/Nav.scss";
import {
  HomeSidebarItems,
  ISideBarItem,
  SettingsSidebarItems,
} from "@typeDefinitions/SidebarItems";
import { AppContainer } from "@state/AppStateContainer";
import { RedirectContainer } from "@state/RedirectContainer";
import { WrapChildrenIf } from "./WrapChildrenIf";
import { AuthorizedRoutes } from "@typeDefinitions/Routes";
import { TestId } from "@tests/TestConstants";

export const SideBar = () => {
  const { pathname } = useLocation();
  const { redirectToRoute } = RedirectContainer.useContainer();
  const { signOut, appState } = AppContainer.useContainer();

  const canViewRoute = (path: string) =>
    (appState.user === undefined &&
      AuthorizedRoutes.indexOf(path as Routes) < 0) ||
    appState.user !== undefined;

  const generateLinksForItems = (items: ISideBarItem[]) => {
    return items
      .sort((a, b) => a.orderBy - b.orderBy)
      .map(({ title, Icon, onPress, linkTo, openInNewTab }) => {
        const isActiveLink = linkTo !== undefined && pathname === linkTo;
        const shouldWrapInAnchor = linkTo !== undefined && canViewRoute(linkTo);
        return (
          <WrapChildrenIf
            condition={shouldWrapInAnchor}
            wrapper={(children) =>
              openInNewTab ? (
                <a href={linkTo} target="_blank" rel="noreferrer">
                  {children}
                </a>
              ) : (
                <Link to={linkTo!}>{children}</Link>
              )
            }
            key={`${title}-${pathname}-nav-item`}
          >
            <li
              className={`nav-item ${shouldWrapInAnchor ? "clickable" : ""} ${
                linkTo === undefined && onPress !== undefined
                  ? "list-group-item-action"
                  : ""
              }`}
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
    if (route && HomeRoutes.indexOf(route) >= 0) {
      return generateLinksForItems(HomeSidebarItems);
    }
    switch (route) {
      case Routes.Settings:
        return generateLinksForItems(
          SettingsSidebarItems({
            signOut: () => signOut(redirectToRoute),
            profileUrl: appState.user.url,
          })
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
          !appState.loading && canViewRoute(pathname as Routes)
            ? (pathname as Routes)
            : undefined
        )}
      </Nav>
    </div>
  );
};
