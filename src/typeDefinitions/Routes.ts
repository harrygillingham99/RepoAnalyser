enum Routes {
  Home = "/home",
  CallbackUrl = "/auth",
  Account = "/account",
  NotFound = "/not-found",
  Unauthorised = "/unauthorised",
}

enum HomeSubRoutes {
  LandingPage = "/landing",
  Repositories = "/repositories",
  PullRequests = "/pull-requests",
  Contributions = "/contributions",
  Commits = "/commits",
}

export { Routes, HomeSubRoutes };
