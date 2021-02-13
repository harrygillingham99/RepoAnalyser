import { ComponentType } from "react";
import { PersonXFill, Lightning, Props } from "react-bootstrap-icons";

export interface ISideBarItem {
  title: string;
  orderBy: number;
  Icon: ComponentType<Props>;
  onPress: () => void;
}

interface IAccountSidebarItemProps {
  signOut: () => void;
}

export const HomeSidebarItems = (): ISideBarItem[] => [
  { title: "Home", orderBy: 1, Icon: Lightning, onPress: () => undefined },
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
    },
  ];
};
