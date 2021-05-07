import clsx from "clsx";
import React from "react";
import { Jumbotron, Container, Row } from "react-bootstrap";

interface IDashboardHeaderProps {
  text: string;
  subtitle?: string;
  imageUrl?: string;
  className?: string;
}
export const DashboardHeader: React.FC<IDashboardHeaderProps> = (props) => {
  return (
    <Jumbotron
      fluid
      className={clsx(props.imageUrl && "pt-3 pb-3", props.className)}
    >
      <Container fluid="xl" className="pl-1 pr-1">
        <Row>
          <div className={clsx("col-12 col-md-8", props.imageUrl && "mt-4")}>
            <h1 className="text-reset">{props.text}</h1>
            <h4>{props.subtitle}</h4>
          </div>

          {props.imageUrl && (
            <div className="col-6 col-md-4">
              <img
                alt="GitHub Profile"
                className="rounded float-right jumbotron-image"
                src={props.imageUrl}
              />
            </div>
          )}
        </Row>
      </Container>
    </Jumbotron>
  );
};
