import React from "react";
import "@styles/App.css";
import { Col, Container, Row } from "react-bootstrap";
import { NavigationBar } from "@components/NavigationBar";
import { Dashboard } from "@components/Dashboard";
import { SideBar } from "@components/SideBar";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import { Routes } from "@typeDefinitions/Routes";
import { Authenticate } from "@components/Authenticate";
import { AppContainer } from "@state/AppState";

const App = () => {
  return (
    <BrowserRouter>
      <AppContainer.Provider>
        <NavigationBar />
        <Container fluid>
          <Row>
            <Col className="col-md-2 d-none d-md-block bg-light sidebar">
              <SideBar />
            </Col>
            <Col className="col-md-9 ml-sm-auto col-lg-10 px-2">
              <Dashboard />
            </Col>
          </Row>
          <Route exact path="/">
            <Redirect to={Routes.Home} />
          </Route>
          <Route exact path={Routes.CallbackUrl} children={<Authenticate />} />
        </Container>
      </AppContainer.Provider>
    </BrowserRouter>
  );
};

export default App;
