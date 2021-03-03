export enum TestId {
  SideBar = "SideBar",
  Dashboard = "Dashboard",
  Nav = "Nav",
  RedirectHandler = "RedirectHandler",
}

export const waitForLoadThenAssert = (
  testFunc: () => void,
  millisecondsToWait: number = 2000
): NodeJS.Timeout => setTimeout(testFunc, millisecondsToWait);
