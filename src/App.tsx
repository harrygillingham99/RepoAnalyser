import React from "react";
import "@styles/App.scss";
import { Col, Container, Row } from "react-bootstrap";
import { NavigationBar } from "@components/BaseComponents/NavigationBar";
import { Dashboard } from "@components/BaseComponents/Dashboard";
import { SideBar } from "@components/BaseComponents/SideBar";
import { Redirect, Route, Switch } from "react-router-dom";
import { Routes } from "@typeDefinitions/Routes";
import { AuthenticationHandler } from "@components/BaseComponents/AuthenticationHandler";
import { AppContainer } from "@state/AppStateContainer";
import { AlertContainer } from "@state/AlertContainer";
import { AppAlert } from "@components/BaseComponents/AppAlert";
import { RedirectContainer } from "@state/RedirectContainer";
import { RedirectHandler } from "@components/BaseComponents/RedirectHandler";
import { FourOhFour } from "@components/BaseComponents/FourOhFour";
import { Unauthorised } from "@components/BaseComponents/Unauthorised";
import { SearchContainer } from "@state/SearchContainer";

const App = () => {
  return (
    <AppContainer.Provider>
      <AlertContainer.Provider>
        <RedirectContainer.Provider>
          <SearchContainer.Provider>
            <NavigationBar />
            <Switch>
              <Route exact path={Routes.CallbackUrl}>
                <AuthenticationHandler />
              </Route>
              <Route exact path="/">
                <Redirect to={Routes.Home} />
              </Route>
              <Route exact path={Routes.NotFound}>
                <FourOhFour />
              </Route>
              <Route exact path={Routes.Unauthorised}>
                <Unauthorised />
              </Route>
              <Route>
                <Container fluid>
                  <Row>
                    <Col className="col-md-2 d-none d-md-block bg-light sidebar">
                      <SideBar />
                    </Col>
                    <Col className="col-md-9 ml-sm-auto col-lg-10 p-0">
                      <AppAlert />
                      <Dashboard />
                    </Col>
                  </Row>
                </Container>
              </Route>
            </Switch>
            <RedirectHandler />
          </SearchContainer.Provider>
        </RedirectContainer.Provider>
      </AlertContainer.Provider>
    </AppContainer.Provider>
  );
};

export default App;
