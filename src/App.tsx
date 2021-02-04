import React from "react";
import "@styles/App.css";
import { Col, Row } from "react-bootstrap";
import { NavigationBar } from "@components/NavigationBar";
import { Dashboard } from "@components/Dashboard";
import { SideBar } from "@components/SideBar";

const App = () => {
  return (
    <>
      <NavigationBar />
      <Row className="justify-content-md-center w-100">
        <Col className="col-md-2 d-none d-md-block bg-light sidebar">
          <SideBar />
        </Col>
        <Col className="col-md-9 ml-sm-auto col-lg-10 px-2">
          <Dashboard />
        </Col>
      </Row>
    </>
  );
};

export default App;
