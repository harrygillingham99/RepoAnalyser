import { DashboardHeader } from "@components/BaseComponents/DashboardHeader"
import { AppContainer } from "@state/AppStateContainer"
import React from "react"

export const LandingRoute = () => {
    const {appState} = AppContainer.useContainer();
    return  <DashboardHeader
    text={`Welcome ${appState?.user?.name ?? "please log in"}`}
  />
}