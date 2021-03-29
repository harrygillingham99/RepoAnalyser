import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

interface IErrorScreenProps {
  title: string;
  message: string;
  redirectTo: Routes;
  redirectSubtitle: string;
}

export const ErrorScreen = (props: IErrorScreenProps) => {
  return (
    <div className="page-wrap d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={12} className="text-center">
            <span className="display-1 d-block">{props.title}</span>
            <div className="mb-4 lead">{props.message}</div>
            <Link to={props.redirectTo} className="btn btn-link">
              {props.redirectSubtitle}
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
