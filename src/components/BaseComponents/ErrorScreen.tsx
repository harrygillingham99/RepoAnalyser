import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { Container } from "react-bootstrap";
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
        <div className="row justify-content-center">
          <div className="col-md-12 text-center">
            <span className="display-1 d-block">{props.title}</span>
            <div className="mb-4 lead">{props.message}</div>
            <Link to={props.redirectTo} className="btn btn-link">
              {props.redirectSubtitle}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
