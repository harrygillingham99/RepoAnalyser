enum Routes {
  CallbackUrl = "/auth",
  Settings = "/settings",
  NotFound = "/not-found",
  Unauthorised = "/unauthorised",
  Landing = "/home/landing",
  Activity = "/home/user-activity",
  Repositories = "/home/repositories",
  PullRequests = "/home/pull-requests",
  Repository = "/home/repository/:repoId",
  PullRequest = "/home/pull-request/:repoId/:pullRequest",
};

const HomeRoutesWithParams = ['/home/pull-request', '/home/repository']

const HomeRoutes: Routes[] = [
  Routes.Activity,
  Routes.Landing,
  Routes.PullRequest,
  Routes.PullRequests,
  Routes.Repositories,
  Routes.Repository,
];

const DashboardRoutes: Routes[] = [
  Routes.Activity,
  Routes.Landing,
  Routes.PullRequest,
  Routes.PullRequests,
  Routes.Repositories,
  Routes.Repository,
  Routes.Settings,
];

const AuthorizedRoutes: Routes[] = [
  Routes.Settings,
  Routes.PullRequest,
  Routes.PullRequests,
  Routes.Repositories,
  Routes.Repository,
  Routes.Activity,
];

export { Routes, AuthorizedRoutes, DashboardRoutes, HomeRoutes, HomeRoutesWithParams };
