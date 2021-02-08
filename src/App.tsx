import React from "react";
import "@styles/App.css";
import { Col, Container, Row } from "react-bootstrap";
import { NavigationBar } from "@components/BaseComponents/NavigationBar";
import { Dashboard } from "@components/BaseComponents/Dashboard";
import { SideBar } from "@components/BaseComponents/SideBar";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import { Routes } from "@typeDefinitions/Routes";
import { Authenticate } from "@components/BaseComponents/Authenticate";
import { AppContainer } from "@state/AppStateContainer";
import { AlertContainer } from "@state/AlertContainer";
import { AppAlert } from "@components/BaseComponents/AppAlert";
import { RedirectContainer } from "@state/RedirectContainer";
import { RedirectHandler } from "@components/BaseComponents/RedirectHandler";

const App = () => {
  return (
    <BrowserRouter>
      <AppContainer.Provider>
        <AlertContainer.Provider>
          <RedirectContainer.Provider>
            <NavigationBar />
            <Container fluid>
              <Row>
                <Col className="col-md-2 d-none d-md-block bg-light sidebar">
                  <SideBar />
                </Col>
                <Col className="col-md-9 ml-sm-auto col-lg-10 px-2">
                  <div className="m-3">
                    <AppAlert />
                    <Dashboard />
                  </div>
                </Col>
              </Row>
              <Route exact path="/">
                <Redirect to={Routes.Home} />
              </Route>
              <Route
                exact
                path={Routes.CallbackUrl}
                children={<Authenticate />}
              />
            </Container>
            <RedirectHandler />
          </RedirectContainer.Provider>
        </AlertContainer.Provider>
      </AppContainer.Provider>
    </BrowserRouter>
  );
};

export default App;
