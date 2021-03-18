import { ComponentType } from "react";
import {
  PersonXFill,
  Lightning,
  Props,
  House,
  Arrow90degRight,
  BookFill,
  Github
} from "react-bootstrap-icons";
import { Routes } from "./Routes";

export interface ISideBarItem {
  title: string;
  orderBy: number;
  Icon: ComponentType<Props>;
  onPress?: () => void;
  linkTo?: string;
  openInNewTab? : boolean
}

interface IAccountSidebarItemProps {
  signOut: () => void;
  profileUrl?: string
}

export const HomeSidebarItems: ISideBarItem[] = [
  {
    title: "Home",
    orderBy: 1,
    Icon: House,
    linkTo: Routes.Landing,
  },
  {
    title: "Activity",
    orderBy: 2,
    Icon: Lightning,
    linkTo: Routes.Activity,
  },
  {
    title: "Repositories",
    orderBy: 3,
    Icon: BookFill,
    linkTo: Routes.Repositories,
  },
  {
    title: "Pull Requests",
    orderBy: 4,
    Icon: Arrow90degRight,
    linkTo: Routes.PullRequests,
  },
];

export const SettingsSidebarItems = (
  props: IAccountSidebarItemProps
): ISideBarItem[] => {
  return [
    {
      title: "GitHub Profile",
      orderBy: 1,
      Icon: Github,
      linkTo: props.profileUrl,
      openInNewTab: true
    },
    {
      title: "Sign Out",
      orderBy: 999,
      Icon: PersonXFill,
      onPress: () => props.signOut(),
    },
  ];
};
