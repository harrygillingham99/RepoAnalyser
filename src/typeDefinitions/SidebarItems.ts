import { ComponentType } from "react";
import { LightbulbFill, Props } from "react-bootstrap-icons";

export interface ISideBarItem {
  title: string;
  orderBy: number;
  Icon: ComponentType<Props>;
  onPress: () => void;
}

export const HomeSidebarItems: ISideBarItem[] = [
  { title: "Home", orderBy: 1, Icon: LightbulbFill, onPress: () => undefined },
];
