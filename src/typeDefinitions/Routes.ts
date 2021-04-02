enum Routes {
  CallbackUrl = "/auth",
  Settings = "/settings",
  NotFound = "/not-found",
  Unauthorised = "/unauthorised",
  Landing = "/home/landing",
  Activity = "/home/user-activity",
  Repositories = "/home/repositories",
  PullRequests = "/home/pull-requests",
  Repository = "/home/repository/:repoId/:repoName",
  PullRequest = "/home/pull-request/:repoId/:pullRequest/:repoName",
}

const HomeRoutesWithParams = ["/home/pull-request", "/home/repository"];

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

//add any more routes with params to the route type definition
const addUrlParameters = (
  route: Routes.Repository | Routes.PullRequest,
  params: { [key: string]: string }
): string => {
  let routeWithParams = route as string;
  Object.keys(params).forEach((key) => {
    routeWithParams = routeWithParams.replace(key, params[key]);
  });
  return routeWithParams;
};

export {
  Routes,
  AuthorizedRoutes,
  DashboardRoutes,
  HomeRoutes,
  HomeRoutesWithParams,
  addUrlParameters,
};
