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

const App = () => {
  return (
    <AppContainer.Provider>
      <AlertContainer.Provider>
        <RedirectContainer.Provider>
          <NavigationBar />
          <Switch>
            <Route exact path={Routes.CallbackUrl}>
              <AuthenticationHandler />
            </Route>
            <Route exact path="/">
              <Redirect to={Routes.Home} />
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
        </RedirectContainer.Provider>
      </AlertContainer.Provider>
    </AppContainer.Provider>
  );
};

export default App;
