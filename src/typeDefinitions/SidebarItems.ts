import { ComponentType } from "react";
import { PersonXFill, Lightning, Props } from "react-bootstrap-icons";
import { HomeSubRoutes, Routes } from "./Routes";

export interface ISideBarItem {
  title: string;
  orderBy: number;
  Icon: ComponentType<Props>;
  onPress?: () => void;
  linkTo?: string;
  forRoute: Routes;
}

interface IAccountSidebarItemProps {
  signOut: () => void;
}

export const HomeSidebarItems = (): ISideBarItem[] => [
  {
    title: "Home",
    orderBy: 1,
    Icon: Lightning,
    onPress: undefined,
    linkTo: HomeSubRoutes.LandingPage,
    forRoute: Routes.Home,
  },
  {
    title: "Repositories",
    orderBy: 2,
    Icon: Lightning,
    onPress: undefined,
    linkTo: HomeSubRoutes.Repositories,
    forRoute: Routes.Home,
  },
  {
    title: "Commits",
    orderBy: 1,
    Icon: Lightning,
    onPress: undefined,
    linkTo: HomeSubRoutes.Commits,
    forRoute: Routes.Home,
  },
  {
    title: "Pull Requests",
    orderBy: 3,
    Icon: Lightning,
    onPress: undefined,
    linkTo: HomeSubRoutes.PullRequests,
    forRoute: Routes.Home,
  },
  {
    title: "Contributions",
    orderBy: 4,
    Icon: Lightning,
    onPress: undefined,
    linkTo: HomeSubRoutes.Contributions,
    forRoute: Routes.Home,
  },
];

export const AccountSidebarItems = (
  props: IAccountSidebarItemProps
): ISideBarItem[] => {
  return [
    {
      title: "Sign Out",
      orderBy: 1,
      Icon: PersonXFill,
      onPress: () => props.signOut(),
      forRoute: Routes.Account,
    },
  ];
};
