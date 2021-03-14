import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";

export const AuthorizedRoutes: string[] = [
  Routes.Settings,
  `${Routes.Home}${HomeSubRoutes.PullRequests}`,
  `${Routes.Home}${HomeSubRoutes.Repositories}`,
  `${Routes.Home}${HomeSubRoutes.Activity}`,
  `${Routes.Home}/repository`,
  `${Routes.Home}/pull-request`,
];
