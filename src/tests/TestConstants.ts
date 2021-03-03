export enum TestId {
  SideBar = "SideBar",
  Dashboard = "Dashboard",
  Nav = "Nav",
  RedirectHandler = "RedirectHandler",
  SideBarRowItem = "SideBarRowItem",
}

export const waitForLoadThenAssert = (
  testFunc: () => void,
  millisecondsToWait = 500
): NodeJS.Timeout => setTimeout(testFunc, millisecondsToWait);
