import { HomeSubRoutes, Routes } from "@typeDefinitions/Routes";

export const AuthorizedRoutes: string[] = [
  Routes.Account,
  `${Routes.Home}${HomeSubRoutes.PullRequests}`,
  `${Routes.Home}${HomeSubRoutes.Commits}`,
  `${Routes.Home}${HomeSubRoutes.Contributions}`,
  `${Routes.Home}${HomeSubRoutes.Repositories}`,
];
