enum Routes {
  Home = "/home",
  CallbackUrl = "/auth",
  Settings = "/settings",
  NotFound = "/not-found",
  Unauthorised = "/unauthorised",
}

enum HomeSubRoutes {
  LandingPage = "/landing",
  Activity = "/user-activity",
  Repositories = "/repositories",
  PullRequests = "/pull-requests",
  Repository = "/repository/:repoId",
  PullRequest = "/pull-request/:repoId/:pullRequest",
}

export { Routes, HomeSubRoutes };
