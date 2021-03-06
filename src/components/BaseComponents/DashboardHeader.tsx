import React from "react";
import { Jumbotron, Container } from "react-bootstrap";

interface IDashboardHeaderProps {
  text: string;
  subtitle?: string;
}
export const DashboardHeader: React.FC<IDashboardHeaderProps> = (props) => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>{props.text}</h1>
        <h4>{props.subtitle}</h4>
      </Container>
    </Jumbotron>
  );
};
