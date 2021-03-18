import { HomeRoutes, Routes, HomeRoutesWithParams } from "@typeDefinitions/Routes";
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
import clsx from "clsx";
import { orderByDescending } from "@utils/Array";

export const SideBar = () => {
  const { pathname } = useLocation();
  const { redirectToRoute } = RedirectContainer.useContainer();
  const { signOut, appState } = AppContainer.useContainer();

  const canViewRoute = (path: string) =>
    (appState.user === undefined &&
      AuthorizedRoutes.indexOf(path as Routes) < 0) ||
    appState.user !== undefined;

  const route : Routes | undefined = (!appState.loading && canViewRoute(pathname as Routes)) ? (pathname as Routes) : undefined

  const generateLinksForItems = (items: ISideBarItem[]) => {
    return orderByDescending(items, 'orderBy')
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
              className={clsx('nav-item', shouldWrapInAnchor && 'clickable')}
              onClick={onPress}
              data-testid={TestId.SideBarRowItem}
            >
              <span className={clsx(' nav-link', isActiveLink && "active")}>
                <Icon className="nav-link-icon" />
                {title}
              </span>
            </li>
          </WrapChildrenIf>
        );
      });
  };

  const getLinksForRoute = (route: Routes | undefined) => {
    if (route && (HomeRoutes.indexOf(route) >= 0 || HomeRoutesWithParams.findIndex(r => route.includes(r)) >= 0)){
      return generateLinksForItems(HomeSidebarItems);
    }
    switch (route) {
      case Routes.Settings:
        return generateLinksForItems(
          SettingsSidebarItems({
            signOut: () => signOut(redirectToRoute),
            profileUrl: appState.user.htmlUrl,
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
        {getLinksForRoute(route)}
      </Nav>
    </div>
  );
};
